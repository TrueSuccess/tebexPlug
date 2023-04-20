
import { events } from "bdsx/event";
import {Tebex} from 'tebex'

const uniter = require('uniter');
const fs = require('fs');
const path = require('path');
const phar = require('phar');
const YAML = require('yaml');

const TEBEX_STORE_SECRET = '5ef660acec77bf57c0357dc28c6621acc5f4d74c'
const tebex = new Tebex(TEBEX_STORE_SECRET)

console.log('[plugin:TebexPlug] allocated');

events.serverOpen.on(async ()=>{

    console.log('[plugin:TebexPlug] launching');
    tebex.information.get().then(console.log);

    const pluginFiles = fs.readdirSync(path.join(process.cwd(), '..', 'plugins'));

    const plugins = (
        await Promise.all(
            pluginFiles.map(async (file: any) => {
                return new Promise((resolve) => {
                    if (!file.includes('.phar')) return resolve(null);
                    const archive = new phar.Archive();

                    archive.loadPharData(
                        fs.readFileSync(
                            path.join(process.cwd(), '..', 'plugins', file)
                        )
                    );
                    const files: any = {};

                    archive.getFiles().forEach((file: any) => {
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
            })
        )
    ).filter((a: any) => a);

    const php = uniter.createEngine('PHP');
    plugins.forEach(async (plugin: any) => {
        let str:String = plugin.main;
        while(str.indexOf('\\')!=-1)
            str = str.replace('\\', '/')

        const main =
            plugin.files[
                `src/${str}.php`
            ];

        if (!main)
            throw new Error('Invalid plugin entry point');

        php.execute(
            main,
            `src/${str}.php`
        );
    });
});

events.serverClose.on(()=>{
    console.log('[plugin:TebexPlug] closed');
});
