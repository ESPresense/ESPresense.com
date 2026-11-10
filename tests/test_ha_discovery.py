import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'tools/check_ha_discovery.py'
spec = importlib.util.spec_from_file_location('ha_discovery', SCRIPT)
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


class DiscoveryCheckTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.fw = self.root / 'firmware'
        self.docs = self.root / 'docs'
        (self.fw / 'main').mkdir(parents=True)
        self.page = self.docs / 'src/content/docs/integrations/home-assistant.md'
        self.page.parent.mkdir(parents=True)
        (self.fw / 'main/mqtt.cpp').write_text('bool sendConnectivityDiscovery() { doc["name"] = "Connectivity"; }')
        (self.fw / 'main/main.cpp').write_text('sendConnectivityDiscovery();\nsendNumberDiscovery("Max Distance", EC_CONFIG);\n')
        self.page.write_text('page\n' + checker.START + '\n' + checker.END + '\n')
        self.assertEqual(self.run_check('--update').returncode, 0)

    def run_check(self, *extra):
        return subprocess.run([sys.executable, str(SCRIPT), '--firmware', str(self.fw), '--docs', str(self.docs), *extra], capture_output=True, text=True)

    def test_both_directions_of_drift_fail(self):
        self.assertEqual(self.run_check().returncode, 0)
        with (self.fw / 'main/main.cpp').open('a') as f:
            f.write('sendButtonDiscovery("New Button", EC_CONFIG);\n')
        result = self.run_check()
        self.assertEqual(result.returncode, 1)
        self.assertIn('+| New Button | button', result.stderr)
        self.assertEqual(self.run_check('--update').returncode, 0)
        self.assertEqual(self.run_check().returncode, 0)
        (self.fw / 'main/main.cpp').write_text('sendConnectivityDiscovery();\n')
        result = self.run_check()
        self.assertEqual(result.returncode, 1)
        self.assertIn('-| Max Distance | number', result.stderr)

    def test_stale_claim_in_inventory_fails(self):
        self.page.write_text(self.page.read_text().replace('| Max Distance |', '| Active Scan |'))
        result = self.run_check()
        self.assertEqual(result.returncode, 1)
        self.assertIn('Active Scan', result.stderr)

    def test_unknown_dynamic_name_and_helper_fail_closed(self):
        for call in ('sendSensorDiscovery(name, EC_NONE);', 'sendNewDiscovery("Example", EC_NONE);',
                     'sendSwitchDiscovery("slug", "Displayed name", EC_NONE);'):
            with self.subTest(call=call):
                (self.fw / 'main/main.cpp').write_text(call)
                self.assertEqual(self.run_check().returncode, 2)

    def test_comments_do_not_become_entities(self):
        with (self.fw / 'main/main.cpp').open('a') as f:
            f.write('// sendButtonDiscovery("Phantom", EC_NONE);\n/* sendNewDiscovery("Phantom"); */\n')
        self.assertEqual(self.run_check().returncode, 0)

    def test_dynamic_input_and_output_display_names(self):
        for filename, helper, identifier, display_name, label in (
            ('Inputs.cpp', 'sendBinarySensorDiscovery', 'in.id()', 'in.name', 'Configured input name'),
            ('Outputs.cpp', 'sendSwitchDiscovery', 'outputs[i].id()', 'outputs[i].name', 'Configured output name'),
        ):
            with self.subTest(filename=filename):
                source = self.fw / 'main' / filename
                self.addCleanup(source.unlink)
                source.write_text(f'{helper}({identifier}, /* display name */ {display_name}, EC_NONE);')
                self.assertEqual(self.run_check('--update').returncode, 0)
                self.assertIn(f'| {label} |', self.page.read_text())
                self.assertEqual(self.run_check().returncode, 0)
                for changed_name in ('"Changed name"', 'other.name'):
                    source.write_text(f'{helper}({identifier}, {changed_name}, EC_NONE);')
                    result = self.run_check()
                    self.assertEqual(result.returncode, 2)
                    self.assertIn('unsupported dynamic discovery display name', result.stderr)
                source.write_text(f'{helper}({identifier});')
                self.assertEqual(self.run_check().returncode, 2)
                source.write_text(f'{helper}({identifier}, {display_name}, EC_NONE);')

    def test_dynamic_led_and_temperature_patterns(self):
        (self.fw / 'main/LEDs.cpp').write_text('sendLightDiscovery(led->getName(), EC_NONE, led->hasRgb(), led->hasRgbw());')
        (self.fw / 'main/DS18B20Sensor.cpp').write_text('sendSensorDiscovery("DS18B20 Temperature " + toStr(i + 1), EC_NONE, "temperature", "°C");')
        self.assertEqual(self.run_check('--update').returncode, 0)
        self.assertIn('| LED &lt;number&gt; | light | When an LED is configured for MQTT control |', self.page.read_text())
        self.assertIn('| DS18B20 Temperature &lt;number&gt; | sensor |', self.page.read_text())
        self.assertEqual(self.run_check().returncode, 0)

    def test_missing_or_duplicate_markers_fail(self):
        self.page.write_text(self.page.read_text() + checker.START)
        self.assertEqual(self.run_check().returncode, 2)


if __name__ == '__main__':
    unittest.main()
