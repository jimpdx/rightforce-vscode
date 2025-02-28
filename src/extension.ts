import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";

const outputChannel = vscode.window.createOutputChannel("Force CLI");

function getRelativePath(uri: vscode.Uri): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return "";
    }

    let relativePath = path.relative(workspaceFolder, uri.fsPath);
    relativePath = relativePath.replace(/\\/g, "/"); // Convert Windows backslashes to forward slashes

    return relativePath;
}

function runCommand(command: string, uri: vscode.Uri) {
    const relativePath = getRelativePath(uri);
    if (!relativePath) return;

    outputChannel.show();
    outputChannel.appendLine(`Running: ${command} ${relativePath}`);

    exec(`${command} ${relativePath}`, (error, stdout, stderr) => {
        if (error) {
            outputChannel.appendLine(`❌ Error: ${error.message}`);
            vscode.window.showErrorMessage(`Command failed: ${error.message}`);
            return;
        }
        if (stdout) {
            outputChannel.appendLine(stdout);
        }
    });
}

export function activate(context: vscode.ExtensionContext) {
    let fetchCommand = vscode.commands.registerCommand("forcecli.fetch", (uri: vscode.Uri) => {
        if (uri) {
            runCommand("force fetch", uri);
        }
    });

    let pushCommand = vscode.commands.registerCommand("forcecli.push", (uri: vscode.Uri) => {
        if (uri) {
            runCommand("force push", uri);
        }
    });

    context.subscriptions.push(fetchCommand, pushCommand);
}

export function deactivate() {
    outputChannel.dispose();
}
