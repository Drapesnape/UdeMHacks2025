package main.java.services;
import main.java.services.commands.*;

// CommandFactory takes a specific type of command and the command's argument as parameters
// and returns an instance of that command type and its argument in the form of a String

public class CommandFactory {

    public static CommandItem createCommand(String command, String argument) {
        switch(command.toUpperCase()) {
            case "SOURCE":
                return new Source(argument);
            case "LOAD":
                return new Load(argument);
            case "SAVE":
                return new Save(argument);
            case "ADD":
                return new Add(argument);
            case "REMOVE":
                return new Remove(argument);
            case "SEARCH":
                return new Search(argument);
            case "PLAY":
                return new Play(argument);
            case "PAUSE":
                return new Pause(argument);
            case "STOP":
                return new Stop(argument);
            case "CLEAR":
                return new Clear(argument);
            case "EXIT":
                return new Exit();
            case "LIST":
                return new List(argument);
            default:
                throw new IllegalArgumentException("Unknown command: " + command);


        }
    }
}
