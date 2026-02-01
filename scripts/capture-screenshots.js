const { chromium } = require('playwright');
const path = require('path');

const IP = '192.168.129.190';
const BASE_URL = `http://${IP}`;
const OUTPUT_DIR = path.join(__dirname, '../images');

(async () => {
    console.log(`Starting capture from ${BASE_URL}...`);
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set a mobile viewport width. Height will be determined by content.
    await page.setViewportSize({ width: 430, height: 1200 });

    try {
        // 1. Full Settings
        console.log('Capturing settings_screen.png...');
        await page.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle' });
        // Wait for content to load
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(OUTPUT_DIR, 'settings_screen.png'), fullPage: true });

        // 2. Calibration (on Settings page)
        console.log('Capturing calibration_screen.png...');
        // Strategy: Wrap the Calibration header and its following siblings in a temporary div to capture just that section.
        await page.evaluate(() => {
            const h2s = Array.from(document.querySelectorAll('h2'));
            const header = h2s.find(h => h.innerText.trim() === 'Calibration');
            if (header) {
                const wrapper = document.createElement('div');
                wrapper.id = 'screenshot-wrapper';
                wrapper.style.padding = '20px';
                wrapper.style.backgroundColor = 'white'; // Ensure background is consistent
                header.parentNode.insertBefore(wrapper, header);

                let curr = header;
                // Move elements into wrapper until next h2 or the save button container
                while (curr && curr.tagName !== 'BUTTON' && !curr.classList.contains('justify-end')) {
                    const next = curr.nextElementSibling;
                    if (next && next.tagName === 'H2') break;
                    wrapper.appendChild(curr);
                    curr = next;
                }
            }
        });

        const wrapper = page.locator('#screenshot-wrapper');
        if (await wrapper.count() > 0) {
            await wrapper.screenshot({ path: path.join(OUTPUT_DIR, 'calibration_screen.png') });
        } else {
            console.error('Calibration section not found to wrap!');
        }

        // 3. Hardware (Sensors)
        console.log('Capturing hardware_screen.png...');
        await page.goto(`${BASE_URL}/hardware`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        // Resize for "full height" of hardware page if needed, or specific section.
        // User wanted "Sensors" screen.
        // We will capture the whole hardware page as "sensors_screen" creates ambiguity. 
        // Let's capture the full page to be safe, as "Hardware" page implies the whole thing.
        // If the user specifically wants the "GPIO Sensors" section, we can try to locate it.
        // Given earlier context, "full height" of the "Hardware" page seems to be the goal.
        await page.screenshot({ path: path.join(OUTPUT_DIR, 'hardware_screen.png'), fullPage: true });

        // 4. Network
        console.log('Capturing network_screen.png...');
        await page.goto(`${BASE_URL}/network`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(OUTPUT_DIR, 'network_screen.png'), fullPage: true });

    } catch (err) {
        console.error('Error executing capture:', err);
    } finally {
        await browser.close();
        console.log('Done.');
    }
})();
