#!/usr/bin/env python3
"""Compare ESP-IDF discovery call sites with the published entity inventory."""
import argparse
import re
import sys
from pathlib import Path

START = '<!-- ha-discovery-inventory:start -->'
END = '<!-- ha-discovery-inventory:end -->'
TYPES = {
    'sendConnectivityDiscovery': 'binary sensor',
    'sendTeleBinarySensorDiscovery': 'binary sensor',
    'sendBinarySensorDiscovery': 'binary sensor',
    'sendTeleSensorDiscovery': 'sensor',
    'sendSensorDiscovery': 'sensor',
    'sendButtonDiscovery': 'button',
    'sendSwitchDiscovery': 'switch',
    'sendNumberDiscovery': 'number',
    'sendLightDiscovery': 'light',
}
DYNAMIC = {
    ('Inputs.cpp', 'sendBinarySensorDiscovery', 'in.id()'): 'Configured input name',
    ('Outputs.cpp', 'sendSwitchDiscovery', 'outputs[i].id()'): 'Configured output name',
    ('LEDs.cpp', 'sendLightDiscovery', 'led->getName()'): 'Configured LED name',
    ('DS18B20Sensor.cpp', 'sendSensorDiscovery', '"DS18B20 Temperature " + toStr(i + 1)'): 'DS18B20 Temperature <number>',
}


def without_comments(text):
    # Preserve strings and line breaks while removing C++ comments.
    pattern = re.compile(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|//[^\n]*|/\*[\s\S]*?\*/')
    return pattern.sub(lambda m: m.group() if m.group()[0] in '\"\'' else re.sub(r'[^\n]', ' ', m.group()), text)


def first_argument(text, offset):
    start = offset
    depth = 0
    in_string = False
    escape = False
    for i in range(offset, len(text)):
        c = text[i]
        if in_string:
            if escape:
                escape = False
            elif c == '\\':
                escape = True
            elif c == '"':
                in_string = False
        elif c == '"':
            in_string = True
        elif c in '([{':
            depth += 1
        elif c in ')]}':
            if depth == 0:
                return text[start:i].strip()
            depth -= 1
        elif c == ',' and depth == 0:
            return text[start:i].strip()
    raise ValueError('unterminated discovery call')


def inventory(firmware):
    main = firmware / 'main'
    if not (main / 'main.cpp').is_file() or not (main / 'mqtt.cpp').is_file():
        raise ValueError(f'{firmware}: expected ESP-IDF firmware checkout with main/main.cpp and main/mqtt.cpp')
    result = set()
    call = re.compile(r'\b(send[A-Za-z0-9_]*Discovery)\s*\(')
    for path in sorted(main.rglob('*.cpp')):
        if path.name == 'mqtt.cpp':
            continue  # helper implementations, rather than announcement call sites
        source = without_comments(path.read_text(encoding='utf-8'))
        for match in call.finditer(source):
            fn = match.group(1)
            if fn == 'sendDeleteDiscovery':
                continue
            if fn not in TYPES:
                raise ValueError(f'{path}: unrecognised discovery helper {fn}; extend the checker')
            expr = first_argument(source, match.end())
            if fn == 'sendConnectivityDiscovery':
                if expr:
                    raise ValueError(f'{path}: unexpected connectivity helper arguments')
                mqtt = without_comments((main / 'mqtt.cpp').read_text(encoding='utf-8'))
                found = re.search(r'bool\s+sendConnectivityDiscovery\s*\(\s*\)\s*\{[\s\S]*?doc\["name"\]\s*=\s*"([^"]+)"', mqtt)
                if not found:
                    raise ValueError('cannot find connectivity entity name in mqtt.cpp')
                name = found.group(1)
            elif (path.name, fn, expr) in DYNAMIC:
                name = DYNAMIC[(path.name, fn, expr)]
            elif re.fullmatch(r'"[^"\\]*"', expr):
                # The overloads taking a slug and a separate display name must
                # not be mistaken for the common (name, category, ...) form.
                tail = source[match.end():]
                if not re.match(re.escape(expr) + r'\s*,\s*EC_[A-Z_]+\b', tail):
                    raise ValueError(f'{path}: unsupported discovery arguments for {fn}; extend the checker')
                name = expr[1:-1]
            else:
                raise ValueError(f'{path}: unsupported dynamic discovery name {expr!r}; extend the checker')
            if path.name == 'main.cpp' and name == 'Count':
                availability = 'When count filters are configured'
            elif path.name in ('main.cpp', 'Updater.cpp', 'Enrollment.cpp'):
                availability = 'Standard node'
            else:
                availability = 'When the relevant hardware or feature is configured'
            result.add((name, TYPES[fn], availability))
    if not result:
        raise ValueError('no discovery entities found')
    return sorted(result, key=lambda item: (item[0].casefold(), item[1], item[2]))


def table(rows):
    result = ['| Entity name | Home Assistant type | Availability |', '| --- | --- | --- |']
    for name, kind, availability in rows:
        result.append(f'| {name.replace("<", "&lt;").replace(">", "&gt;")} | {kind} | {availability} |')
    return '\n'.join(result)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--firmware', type=Path, required=True, help='path to the ESPresense firmware checkout')
    parser.add_argument('--docs', type=Path, default=Path(__file__).resolve().parents[1], help='path to the documentation checkout')
    parser.add_argument('--update', action='store_true', help='update the marked inventory in the documentation')
    args = parser.parse_args()
    page = args.docs / 'src/content/docs/integrations/home-assistant.md'
    try:
        text = page.read_text(encoding='utf-8')
        if text.count(START) != 1 or text.count(END) != 1 or text.index(START) > text.index(END):
            raise ValueError(f'{page}: expected exactly one ordered pair of inventory markers')
        before, rest = text.split(START, 1)
        actual, after = rest.split(END, 1)
        expected = '\n\n' + table(inventory(args.firmware)) + '\n\n'
        if args.update:
            page.write_text(before + START + expected + END + after, encoding='utf-8')
            print(f'Updated {page}')
        elif actual != expected:
            import difflib
            print('Home Assistant inventory differs from firmware:', file=sys.stderr)
            print(''.join(difflib.unified_diff(actual.splitlines(True), expected.splitlines(True), fromfile='documentation', tofile='firmware')), file=sys.stderr)
            return 1
        else:
            print('Home Assistant discovery inventory matches firmware.')
    except (OSError, ValueError) as error:
        print(f'discovery check: {error}', file=sys.stderr)
        return 2
    return 0


if __name__ == '__main__':
    sys.exit(main())
