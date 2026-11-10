# Testing

## Home Assistant discovery inventory

The discovery check compares the marked table in
`src/content/docs/integrations/home-assistant.md` with the ESP-IDF firmware's
`main/*.cpp` discovery calls. It also checks names generated from known dynamic
input, output, light and DS18B20 calls. Unknown helpers or dynamic expressions
fail closed and need an explicit checker update. The table includes optional
hardware and user-configured features; it is not a promise that every entity
appears on every node. Deletion announcements are not published entities.

From the documentation repository, with a firmware checkout next to it:

```sh
python3 -m unittest discover -s tests -p 'test_ha_discovery.py' -v
python3 tools/check_ha_discovery.py --firmware ../ESPresense
# After reviewing firmware changes, regenerate the inventory:
python3 tools/check_ha_discovery.py --firmware ../ESPresense --update
```

The check runs on every pull request and on pushes to main in each repository.
A docs PR compares its checkout to firmware main; a firmware PR compares its
checkout to docs main. For coordinated changes, run the documentation workflow
manually on the docs branch with `firmware_ref` set to the firmware PR head SHA;
this verifies the exact pair. The default PR checks can fail until both sides
are merged, so coordinate the merge order and any required-check exception with
maintainers; do not point an ordinary PR check at an untrusted matching branch.

The check inventories supported discovery helper calls, not arbitrary prose or
runtime execution. Keep entity lists in the marked inventory and link to it
from other pages. Review prose and screenshot claims separately, and update the
checker when discovery implementation patterns or availability conditions change.
