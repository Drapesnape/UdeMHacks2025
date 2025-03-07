package main.java.services.commands;

import main.java.services.CommandItem;
import main.java.services.MusicLibrary;


public class Play extends CommandItem {
    public Play(String argument) {
        super(argument);
    }

    @Override
    public String getCommand() {
        return "PLAY";
    }

    @Override
    public void execute() {
        MusicLibrary library = MusicLibrary.getInstance();
        if(getArgument().matches("\\d+")) {
            library.playItem(Integer.parseInt(getArgument()));
        } else {
            String[] parts = getArgument().split(" by ");
            library.playItem(parts[0], parts[1]);
        }
    }
}
