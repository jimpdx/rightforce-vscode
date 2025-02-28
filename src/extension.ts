import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";

function getRelativePath(uri: vscode.Uri): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return "";
    }

    // Convert absolute path to relative path
    let relativePath = path.relative(workspaceFolder, uri.fsPath);

    // Convert backslashes to forward slashes
    relativePath = relativePath.replace(/\\/g, "/");

    return relativePath;
}

function runCommand(command: string, uri: vscode.Uri) {
    const relativePath = getRelativePath(uri);
    if (!relativePath) return;

    const terminal = vscode.window.createTerminal("Force CLI");
    terminal.show();
    terminal.sendText(`${command} ${relativePath}`);
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

export function deactivate() {}
