package main.java.services.commands;

import main.java.services.CommandItem;
import main.java.services.MusicLibrary;
import main.java.services.MusicLibraryFileHandler;

public class Load extends CommandItem {
    public Load(String argument) {
        super(argument);
    }

    @Override
    public String getCommand() {
        return "LOAD";
    }

    @Override
    public void execute() {
        String filename = getArgument().isEmpty() ? "POOphonia.csv" : getArgument();
        MusicLibrary.getInstance().setItems(
                MusicLibraryFileHandler.loadLibrary(filename)
        );
    }
}
