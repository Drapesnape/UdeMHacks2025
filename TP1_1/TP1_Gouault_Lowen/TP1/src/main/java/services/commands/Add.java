package main.java.services.commands;

import main.java.services.CommandItem;
import main.java.services.MusicLibrary;
import main.java.models.MusicItemFactory;
import main.java.ui.Message;

import java.util.Arrays;

public class Add extends CommandItem {

    public Add(String argument) {
        super(argument);
    }

    // Getters
    @Override
    public String getCommand() {
        return "ADD";
    }


    // Methods
    @Override
    public void execute() {
        String[] params = getArgument().split(",");
        if (params.length == 1 && params[0].isEmpty()) {
            Message.sendErr("Invalid ADD command: ADD" + getArgument());
            return;
        }
        // Number of parameters must equal to 7
        if(params.length != 7) {
            Message.sendErr("Wrong number of element: ADD" + getArgument());
            return;
        }
        
        MusicLibrary.getInstance().addItem(MusicItemFactory.createItem(params));
    }
}
