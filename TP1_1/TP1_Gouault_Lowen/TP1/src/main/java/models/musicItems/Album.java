package main.java.models.musicItems;

import main.java.models.MusicItem;

public final class Album extends MusicItem {

    private final String artist;
    private final int numberOfTracks;
    private final String label;

    public Album(String[] info) {
        super(info);
        this.artist = info[4];
        this.label = info[5];
        this.numberOfTracks = Integer.parseInt(info[6]);

    }

    @Override
    public String toCSV() {
        String info = super.toCSV();
        return "album," + info + artist + label + numberOfTracks;
    }

    @Override
    public String toString() {
        return "Album " + getTitle() + " of " + getReleaseYear() +
                " with " + numberOfTracks + " tracks by " + artist;
    }

    @Override
    public String getInfo() {
        return "Album [ID=" + getId() + ", Title=" + getTitle() + "...";
                // TODO
    }
}
