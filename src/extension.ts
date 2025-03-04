import * as vscode from "vscode";
import * as path from "path";

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

function escapeFilePath(filePath: string): string {
    return filePath.replace(/ /g, "\\ "); // Escape spaces without adding quotes
}

function runCommand(command: string, uri: vscode.Uri) {
    const relativePath = getRelativePath(uri);
    if (!relativePath) return;

    const escapedPath = escapeFilePath(relativePath);

    // Check for an existing terminal
    let terminal = vscode.window.activeTerminal;
    if (!terminal) {
        terminal = vscode.window.createTerminal("Force CLI");
    }

    terminal.show();
    terminal.sendText(`${command} ${escapedPath}`);
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
