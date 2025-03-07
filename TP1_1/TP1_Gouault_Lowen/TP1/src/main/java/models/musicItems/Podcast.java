package main.java.models.musicItems;

import main.java.models.MusicItem;

public final class Podcast extends MusicItem {

    private String host;
    private int episodeNumber;
    private String topic;

    public Podcast(String[] info){
        super(info);
        this.host = info[4];
        this.topic = info[5];
        this.episodeNumber = Integer.parseInt(info[6]);

    }

    @Override
    public String toCSV() {
        String info = super.toCSV();
        return "song," + info + host + topic + episodeNumber;
    }

    // Podcast Science Weekly episode 24 of 2022 on Science by John Smith
    @Override
    public String toString() {
        return "Podcast " + getTitle() + " episode " + episodeNumber +
                " of " + getReleaseYear() + " on " + topic + " by " + host;
    }

    @Override
    public String getInfo() {
        return "Podcast [ID=" + getId() + ", Title=" + getTitle() + "...";
        // TODO
    }
}
