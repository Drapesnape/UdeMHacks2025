package main.java.services;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

import main.java.ui.Message;


/**
 * TO DO:
 *      - "processCommands" class
 */

public final class CommandProcessor {

    // Constant representing the default command file, that is used when no specific path is provided
    // to the constructor processCommands()
    private static final String DEFAULT_COMMAND_FILE = "src\\data\\commands.txt";
    // Indicates if the process is currently running
    private static volatile boolean isProcessing = false;
    // Object of type File that represents the file currently being processed
    private static volatile File currentFile;
    //
    private static final ArrayList<CommandItem> commands = new ArrayList<>();


    public static void processCommands(MusicLibrary library, String commandFilePath) {

        //Check if a file is currently being processed. If isProcessing = true, then ignore the command.
        //Else, process the given file
        if (isProcessing) {
            Message.sendErr("Currently sourcing " + currentFile.getName() + "; SOURCE ignored.");
        } else {

            // Start of process
            isProcessing = true;
            // Local variable used to indicate if the try block was successful (base value false).
            boolean success = false;

            try {
                if (!commandFilePath.isEmpty()){
                    currentFile = new File(commandFilePath);
                } else {
                    currentFile = new File(DEFAULT_COMMAND_FILE);
                }
                Message.send("Sourcing " + currentFile.getName() + "...");
                Scanner scanner = new Scanner(currentFile);
                while (scanner.hasNextLine()) {
                    String line = scanner.nextLine();
                    if(!line.startsWith("#") && !line.trim().isEmpty()) {
                        String[] parts = line.split(" ", 2);
                        String commandType = parts[0];
                        // Check if the command has an argument; if not, argument is empty
                        String argument = (parts.length > 1) ? parts[1] : "";
                        // Create an executable command instance of the type defined by commandType
                        CommandItem cmd = CommandFactory.createCommand(commandType, argument);
                        commands.add(cmd);
                    }
                }
                scanner.close();
                // Read was successful, reassign success to true
                success = true;
            } catch (FileNotFoundException fnfe) {
                Message.sendErr("Sourcing " + currentFile.getName() + " failed; file not found.");
            } catch (Exception e) {
                Message.sendErr("Error reading command file: " + currentFile.getName());
            } finally{
                isProcessing = false;
                currentFile = null;
            }

            // If processing was successful, execute the retrieved commands
            if (success) {
                for (CommandItem cmd : commands) {
                    cmd.getCommand();
                }
            }

        }
    }
}