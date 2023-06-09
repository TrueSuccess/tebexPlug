"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("bdsx/event");
const tebex_1 = require("tebex");
const uniter = require('uniter');
const fs = require('fs');
const path = require('path');
const phar = require('phar');
const YAML = require('yaml');
const TEBEX_STORE_SECRET = '5ef660acec77bf57c0357dc28c6621acc5f4d74c';
const tebex = new tebex_1.Tebex(TEBEX_STORE_SECRET);
console.log('[plugin:TebexPlug] allocated');
event_1.events.serverOpen.on(async () => {
    console.log('[plugin:TebexPlug] launching');
    tebex.information.get().then(console.log);
    const pluginFiles = fs.readdirSync(path.join(process.cwd(), '..', 'plugins'));
    const plugins = (await Promise.all(pluginFiles.map(async (file) => {
        return new Promise((resolve) => {
            if (!file.includes('.phar'))
                return resolve(null);
            const archive = new phar.Archive();
            console.log(path.join(process.cwd(), '..', 'plugins', file));
            archive.loadPharData(fs.readFileSync(path.join(process.cwd(), '..', 'plugins', file)));
            const files = {};
            archive.getFiles().forEach((file) => {
                files[file.getName()] = file.getContents();
            });
            const config = YAML.parse(files['plugin.yml']);
            resolve({
                name: config.name,
                version: config.version,
                description: config.description,
                main: config.main,
                files
            });
        });
    }))).filter((a) => a);
    const php = uniter.createEngine('PHP');
    plugins.forEach(async (plugin) => {
        let str = plugin.main;
        while (str.indexOf('\\') != -1)
            str = str.replace('\\', '/');
        const main = plugin.files[`src/${str}.php`];
        console.log(plugin.files, plugin.main, `src/${str}.php`);
        if (!main)
            throw new Error('Invalid plugin entry point');
        php.execute(main, `src/${str}.php`);
    });
});
event_1.events.serverClose.on(() => {
    console.log('[plugin:TebexPlug] closed');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHNDQUFvQztBQUNwQyxpQ0FBMkI7QUFFM0IsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU3QixNQUFNLGtCQUFrQixHQUFHLDBDQUEwQyxDQUFBO0FBQ3JFLE1BQU0sS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7QUFFM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBRTVDLGNBQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBRyxFQUFFO0lBRTNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFMUMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUU5RSxNQUFNLE9BQU8sR0FBRyxDQUNaLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFTLEVBQUUsRUFBRTtRQUNoQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxELE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRW5DLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQzVELE9BQU8sQ0FBQyxZQUFZLENBQ2hCLEVBQUUsQ0FBQyxZQUFZLENBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FDbEQsQ0FDSixDQUFDO1lBQ0YsTUFBTSxLQUFLLEdBQVEsRUFBRSxDQUFDO1lBRXRCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtnQkFDckMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDL0MsT0FBTyxDQUFDO2dCQUNKLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDakIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dCQUN2QixXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7Z0JBQy9CLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDakIsS0FBSzthQUNSLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQ0wsQ0FDSixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFXLEVBQUUsRUFBRTtRQUNsQyxJQUFJLEdBQUcsR0FBVSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzdCLE9BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBRSxDQUFDLENBQUM7WUFDdkIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBRWhDLE1BQU0sSUFBSSxHQUNOLE1BQU0sQ0FBQyxLQUFLLENBQ1IsT0FBTyxHQUFHLE1BQU0sQ0FDbkIsQ0FBQztRQUVOLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQTtRQUN4RCxJQUFJLENBQUMsSUFBSTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUVsRCxHQUFHLENBQUMsT0FBTyxDQUNQLElBQUksRUFDSixPQUFPLEdBQUcsTUFBTSxDQUNuQixDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUUsRUFBRTtJQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDN0MsQ0FBQyxDQUFDLENBQUMifQ==