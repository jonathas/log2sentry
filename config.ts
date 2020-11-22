import clear from "clear";
import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import pkg from "./package.json";
import { readFile, writeFile } from "fs";
import { promisify } from "util";
const read = promisify(readFile);
const write = promisify(writeFile);


class Config {
    private config = {
        functionName: "",
        bucketName: "",
        awsProfile: ""
    };

    public constructor() {
        this.header();
        this.questions();
    }

    private header(): void {
        clear();
        console.log(chalk.blue(
            figlet.textSync("Log2Sentry config", { horizontalLayout: "full" })
        ));
        console.log("");
    }

    private async questions(): Promise<void> {
        try {
            const { functionName } = await inquirer.prompt([{
                type: "input",
                name: "functionName",
                message: "What is your function name on AWS?"
            }]);
            this.config.functionName = functionName;
    
            const { bucketName } = await inquirer.prompt([{
                type: "input",
                name: "bucketName",
                message: "What is the bucket name on AWS that will be used for deploying the lambda?"
            }]);
            this.config.bucketName = bucketName;
    
            const { awsProfile } = await inquirer.prompt([{
                type: "input",
                name: "awsProfile",
                message: "What is the AWS profile (configured on ~/.aws/credentials) that will be used for deploying the lambda?"
            }]);
            this.config.awsProfile = awsProfile;
    
            const { confirmed } = await inquirer.prompt([{
                type: "confirm",
                name: "confirmed",
                message: "Confirm the data entered above?"
            }]);
    
            if (!confirmed) {
                this.questions();
            }
    
            await this.updateDeployScript();
            await this.updatePackageJson();
        } catch (err) {
            console.error(err);
        }
    }

    private async updateDeployScript(): Promise<void> {
        const deployScriptPath = "./deploy.sh";
        const content = await read(deployScriptPath, "utf8");
        
        const newContent = content
            .replace(/myfunctionname/g, this.config.functionName)
            .replace("mybucket", this.config.bucketName)
            .replace("myprofile", this.config.awsProfile);

        console.log("... writing deploy.sh");
        await write(deployScriptPath, newContent);
    }

    private async updatePackageJson(): Promise<void> {
        pkg.scripts.package = pkg.scripts.package
            .replace("mybucket", this.config.bucketName)
            .replace("myprofile", this.config.awsProfile);

        console.log("... writing package.json");
        await write("./package.json", JSON.stringify(pkg, null, 4));
    }

}

new Config();
