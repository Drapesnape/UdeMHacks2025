package main.java.services.commands;

import main.java.services.CommandItem;
import main.java.services.MusicLibrary;
import static main.java.services.CommandProcessor.processCommands;

public class Source extends CommandItem {

    // Music library instance
    private MusicLibrary library;

    public Source(String argument) {
        super(argument);
    }

    // Getters
    @Override
    public String getCommand() {
        return "SOURCE";
    }

    @Override
    public String getArgument() {
        return super.getArgument();
    }

    public String setLibrary(MusicLibrary library) {
        this.library = library;
    }

    @Override
    public void execute() {

        String filePath = getArgument();
        processCommands(library, filePath);
    }
}
