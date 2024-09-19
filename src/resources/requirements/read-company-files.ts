import { Injectable } from '@nestjs/common';
import fsPromises, {
  readFile,
  readdir,
  appendFile,
  mkdir,
  writeFile,
} from 'node:fs/promises';
import fs, { existsSync } from 'fs';
import path, { join } from 'path';

@Injectable()
export class ReadCompanyFilesFactory {
  async getGoldPlanRequirements(directory: string) {

    // TODO: look for a way to customize this action.
    try {

      const files = await readdir(directory);
      files.forEach(async (file) => {
        const fileContent = await readFile(directory + file, {
          encoding: 'utf8',
        });
        const jsonData = JSON.stringify(fileContent);
        if (!existsSync(join(__dirname, '..', 'data'))) {
          await mkdir(join(__dirname, '..', 'data'));
        }

        await appendFile(join(__dirname, '..', 'data', 'data.json'), jsonData);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getSilverPlanRequirements(directory: string) {
    // TODO: look for a way to customize this action.

    try {
      const files = await readdir(directory);
      files.forEach(async (file) => {
        if (file.toString().includes("_1") || file.toString().includes("_2")) {
          const fileContent = await readFile(directory + file, {
            encoding: 'utf8',
          });
          const jsonData = JSON.stringify(fileContent);
          if (!existsSync(join(__dirname, '..', 'data'))) {
            await mkdir(join(__dirname, '..', 'data'));
          }
          await appendFile(join(__dirname, '..', 'data', 'data.json'), jsonData);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getBronzePlanRequirements(directory: string) {

    try {
      const files = await readdir(directory);
      files.forEach(async (file) => {
        if (file.toString().includes("_2")) {
          const fileContent = await readFile(directory + file, {
            encoding: 'utf8',
          });
          const jsonData = JSON.stringify(fileContent);
          if (!existsSync(join(__dirname, '..', 'data'))) {
            await mkdir(join(__dirname, '..', 'data'));
          }
          await appendFile(join(__dirname, '..', 'data', 'data.json'), jsonData);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}
