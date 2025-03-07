package main.java.services;

public abstract class CommandItem {

    private final String argument;

    protected CommandItem(String argument) {
        this.argument = argument;
    }

    public abstract String getCommand();

    public String getArgument() {
        return this.argument;
    }

    public abstract void execute();
}
