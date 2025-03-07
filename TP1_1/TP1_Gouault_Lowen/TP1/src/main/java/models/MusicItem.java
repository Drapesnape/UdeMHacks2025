package main.java.models;

public abstract class MusicItem {

    private final int id;
    private final String title;
    private final int releaseYear;
    private boolean isPlaying;
    private boolean isCurrentItem;

    public MusicItem(String[] info) {
        this.id = Integer.parseInt(info[1]);
        this.title = info[2];
        this.releaseYear = Integer.parseInt(info[3]);
        this.isPlaying = false;
    }

    // Setters
    public void play(){
        this.isPlaying = true;
        this.isCurrentItem = true;
    }

    public void pause(){
        this.isPlaying = false;
    }

    public void stop(){
        this.isPlaying = false;
        this.isCurrentItem = false;
        //TODO
    }

    // Getters
    public int getId() {
        return this.id;
    }

    public String getTitle() {
        return this.title;
    }

    public int getReleaseYear() {
        return this.releaseYear;
    }

    public String toCSV(){
        return this.id + "," + this.title + "," + this.releaseYear;
    }

    public String toString(){
        return null;
    }

    public String getInfo(){
        return null;
        // TODO
    }


}
