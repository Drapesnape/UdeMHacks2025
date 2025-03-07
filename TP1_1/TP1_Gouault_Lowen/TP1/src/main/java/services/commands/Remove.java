package main.java.services.commands;

import main.java.services.CommandItem;

public class Remove extends CommandItem {

    public Remove(String argument) {
        super(argument);
    }

    @Override
    public String getCommand() {
        return "REMOVE";
    }

    @Override
    public void execute() {

    }
}
