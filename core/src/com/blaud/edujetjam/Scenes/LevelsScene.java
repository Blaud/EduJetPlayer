package com.blaud.edujetjam.Scenes;

import com.badlogic.gdx.utils.viewport.FitViewport;
import com.blaud.edujetjam.Scenes.uiStages.LevelsUI;
import com.uwsoft.editor.renderer.SceneLoader;
import com.uwsoft.editor.renderer.components.additional.ButtonComponent;
import com.uwsoft.editor.renderer.utils.ItemWrapper;

/**
 * Created by blaud on 21.09.2016.
 */
public enum LevelsScene {
    INSTANCE;

    public SceneLoader levelsScene;
    private ItemWrapper rootItem;
    public LevelsUI sceneUI;

    private LevelsScene() {
        levelsScene = new SceneLoader();
        levelsScene.loadScene("LevelsScene",new FitViewport(800, 480));

        rootItem = new ItemWrapper(levelsScene.getRoot());
        // rootItem.getChild("deer").addScript(deer);

        // all entities with button tag now have ButtonComponent
        levelsScene.addComponentsByTagName("button", ButtonComponent.class);

        sceneUI = new LevelsUI(levelsScene);

    }

    public void ShowNow(){
        SceneManager.INSTANCE.CurrentScene=levelsScene;
        sceneUI = new LevelsUI(levelsScene);
        SceneManager.INSTANCE.sceneUI = sceneUI;
    }
}
