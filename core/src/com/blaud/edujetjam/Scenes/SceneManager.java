package com.blaud.edujetjam.Scenes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.uwsoft.editor.renderer.SceneLoader;

/**
 * Created by blaud on 18.09.2016.
 */
public enum SceneManager {
    INSTANCE;
    public SceneLoader CurrentScene;
    public Stage sceneUI;

    private SceneManager() {
        CurrentScene = MenuScene.INSTANCE.menuScene;
        sceneUI = MenuScene.INSTANCE.sceneUI;
    }

    public void DrawCurrentScene(){
        CurrentScene.getEngine().update(Gdx.graphics.getDeltaTime());
        sceneUI.act();
        sceneUI.draw();
    }

}
