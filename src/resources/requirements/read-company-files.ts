import { Injectable } from "@nestjs/common";
import fsPromises, { readFile, readdir, appendFile, mkdir } from 'node:fs/promises';
import fs, { existsSync } from 'fs';
import path, { join } from 'path';


@Injectable()
export class ReadCompanyFiles {


    async getAllFiles(directory: string) {
        let fileArr: string[] = [];
        console.log(join(__dirname, "data"));

        try {
            const files = await readdir(directory);
            files.forEach(async (file) => {
                const fileContent = await readFile(directory + file, { encoding: 'utf8' })
                const jsonData = JSON.stringify(fileContent);
                if (!existsSync(join(__dirname, "..", "data"))) {
                    await mkdir(join(__dirname, "..", "data"));
                }
                await appendFile(
                    join(__dirname, "..", "data", 'data.json'), jsonData
                );
            })

        } catch (err) {
            console.error(err);
        }
    }
}