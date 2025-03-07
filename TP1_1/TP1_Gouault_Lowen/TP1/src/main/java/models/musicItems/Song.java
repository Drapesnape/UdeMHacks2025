package main.java.models.musicItems;

import main.java.models.MusicItem;

public final class Song extends MusicItem {

    private final String artist;
    private final String genre;
    private final int duration;

    public Song(String[] info) {
        super(info);
        this.artist = info[4];
        this.genre = info[5];
        this.duration = Integer.parseInt(info[6]);

    }

    @Override
    public String toCSV() {
        String info = super.toCSV();
        return "song," + info + artist + genre + duration;
    }

    @Override
    public String toString() {
        return "Song of " + getReleaseYear() + " " +
                getTitle() + " by " + artist;
    }

    @Override
    public String getInfo() {
        return "Podcast [ID=" + getId() + ", Title=" + getTitle() + "...";
        // TODO
    }

}

