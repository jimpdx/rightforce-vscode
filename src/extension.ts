import * as vscode from "vscode";
import { exec } from "child_process";

function runCommand(command: string, filePath: string) {
    const terminal = vscode.window.createTerminal("Force CLI");
    terminal.show();
    terminal.sendText(`${command} ${filePath}`);
}

export function activate(context: vscode.ExtensionContext) {
    let fetchCommand = vscode.commands.registerCommand("forcecli.fetch", (uri: vscode.Uri) => {
        if (uri) {
            runCommand("force fetch", uri.fsPath);
        }
    });

    let pushCommand = vscode.commands.registerCommand("forcecli.push", (uri: vscode.Uri) => {
        if (uri) {
            runCommand("force push", uri.fsPath);
        }
    });

    context.subscriptions.push(fetchCommand, pushCommand);
}

export function deactivate() {}
