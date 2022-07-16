import handleCreateMenu from "./handleCreateMenu.js";
import handleEditMenu from "./handleEditMenu.js";
import handleDeleteMenu from "./handleDeleteMenu.js";

export async function handleMainMenu(str) {
    switch (str) {
        case "create":
            await handleCreateMenu();
            break;
        case "edit":
            await handleEditMenu();
            break;
        case "delete":
            await handleDeleteMenu();
            break;
        case "exit":
        default:
            process.exit();
            break;
    }
}