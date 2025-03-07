package main.java.services;
import java.util.ArrayList;
import main.java.models.*;

/**
 * TO DO:
 *      -"save" class
 *      -
 *
 *
 * */

public class MusicLibrary {

    // list of music items
    private ArrayList<MusicItem> items;

    // instance of MusicLibrary, useful for getInstance method
    //private static volatile MusicLibrary instance;

    // Id of the item currently first in queue
    private int currentItemId = 0;

    // Constructor
    public MusicLibrary(String libraryName){
        items = MusicLibraryFileHandler.loadLibrary(libraryName);
    }

    //Setters
    public void addItem(MusicItem item) {


        this.items.add(item);
    }

    public void removeItem(int id){
        for(int i = 0; i < items.size(); i++){
            if(items.get(i).getId() == id){
                items.remove(i);
                break; // When item removed, stop search.
            }
        }
    }


    public void playItem(int id){
        for (MusicItem item : items) {
            if(item.getId() == id){
                item.play();
                currentItemId = id;
            }else{
                break;
                //error TODO
            }
        }
    }

    public void pauseItem(){
        if(currentItemId > 0){
            for (MusicItem item : items) {
                if(item.getId() == currentItemId) {
                    item.pause();
                }
            }
        }else{
            //error: no song playing
        }
    }

    public void stopItem(){
        if(currentItemId > 0){
            for (MusicItem item : items) {
                if(item.getId() == currentItemId) {
                    item.stop();
                    this.currentItemId = 0;
                }
            }
        }else{
            //error: no song playing
        }
    }

    public void clearAllItems(){
        items.clear();
    }

    //Getters
    public void listAllItems(){
        for(MusicItem item : items){
            System.out.println(item.getInfo());
            // TODO
        }
    }
}

