import {
    readFile,
    readdir,
    appendFile,
    mkdir,
} from 'node:fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

abstract class RequirementData {

    constructor(
        public plan_name: string,
        public directory: string) {
    }
    /**
     * Abstract method to get the requirement data based on the plan name.
     * @param dir the directory path where the requirement files are located
     * @returns the requirement data as a string
     */
    abstract getRequirementData(): void;
}

// gold class
export class GoldPlanRequirements extends RequirementData {

    constructor(plan_name: string,
        directory: string) {
        super(plan_name, directory);
    }
    async getRequirementData() {
        console.log("fetching all Reqs for gold plan : ",)       // TODO: look for a way to customize this action.
        try {
            const files = await readdir(this.directory);
            files.forEach(async (file) => {
                const fileContent = await readFile(this.directory + file, {
                    encoding: 'utf8',
                });
                // const jsonData = JSON.stringify(fileContent);
                if (!existsSync(join(__dirname, '..', 'data'))) {
                    await mkdir(join(__dirname, '..', 'data'));
                }

                await appendFile(join(__dirname, '..', 'data', 'data.json'), `,${fileContent}`);
            });

        } catch (err) {
            console.error(err);
        }
    }
}


// silver class
export class SilverPlanRequirements extends RequirementData {

    constructor(plan_name: string,
        directory: string) {
        super(plan_name, directory);
    }
    async getRequirementData() {
        try {
            const files = await readdir(this.directory);
            // exptract target files.
            const targetFiles = files.map(file => file.toString().includes('_1') || file.toString().includes('_2'));
            targetFiles.forEach(async (file) => {
                if (file.toString().includes("_1") || file.toString().includes("_2")) {
                    const fileContent = await readFile(this.directory + file, {
                        encoding: 'utf8',
                    });

                    if (!existsSync(join(__dirname, '..', 'data'))) {
                        await mkdir(join(__dirname, '..', 'data'));
                    }
                    await appendFile(join(__dirname, '..', 'data', 'data.json'), fileContent);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
}

// bronze class
export class BronzePlanRequirements extends RequirementData {

    constructor(plan_name: string,
        directory: string) {
        super(plan_name, directory);
    }
    async getRequirementData() {
        try {
            const files = await readdir(this.directory);
            // extract the target file.
            const targetFile = files.find(file => file.includes('_2'));
            if (targetFile) {
                const fileContent = await readFile(this.directory + targetFile, {
                    encoding: 'utf8',
                });

                if (!existsSync(join(__dirname, '..', 'data'))) {
                    await mkdir(join(__dirname, '..', 'data'));
                }
                await appendFile(join(__dirname, '..', 'data', 'data.json'), fileContent);
            }
        } catch (err) {
            console.error(err);
        }
    }
}