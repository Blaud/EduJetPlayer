package com.blaud.edujetjam.Scenes;

import com.badlogic.gdx.utils.viewport.FitViewport;
import com.blaud.edujetjam.Scenes.uiStages.GameUI;
import com.blaud.edujetjam.Scenes.uiStages.MenuUI;
import com.uwsoft.editor.renderer.SceneLoader;
import com.uwsoft.editor.renderer.utils.ItemWrapper;

/**
 * Created by blaud on 21.09.2016.
 */
public enum GameScene {
    INSTANCE;

    public SceneLoader gameScene;
    private ItemWrapper rootItem;
    public GameUI sceneUI;


    private GameScene() {
    }

    public void ShowGame(String lvlname){
        initLvl(lvlname);
        SceneManager.INSTANCE.CurrentScene= gameScene;
        SceneManager.INSTANCE.sceneUI = sceneUI;
    }

    private void initLvl(String lvlname){
        gameScene = new SceneLoader();
        gameScene.loadScene(lvlname, new FitViewport(800, 480));
        sceneUI = new GameUI(gameScene);
    }
}
