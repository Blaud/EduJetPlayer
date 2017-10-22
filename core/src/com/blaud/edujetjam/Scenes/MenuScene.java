package com.blaud.edujetjam.Scenes;

import com.badlogic.gdx.utils.viewport.FitViewport;
import com.blaud.edujetjam.Scenes.uiStages.LevelsUI;
import com.blaud.edujetjam.Scenes.uiStages.MenuUI;
import com.uwsoft.editor.renderer.SceneLoader;
import com.uwsoft.editor.renderer.components.additional.ButtonComponent;
import com.uwsoft.editor.renderer.data.SceneVO;
import com.uwsoft.editor.renderer.utils.ItemWrapper;
import com.uwsoft.editor.renderer.resources.IResourceRetriever;

/**
 * Created by blaud on 19.09.2016.
 */
public enum MenuScene {
    INSTANCE;

            public SceneLoader menuScene;
            private ItemWrapper rootItem;
            public MenuUI sceneUI;


            private MenuScene() {
                menuScene = new SceneLoader();
                menuScene.loadScene("MainScene",new FitViewport(800, 480));

                    //getAllscenesNames
                for (SceneVO x:menuScene.getRm().getProjectVO().scenes
                     ) {
                    System.out.println(x.sceneName);
                }


                rootItem = new ItemWrapper(menuScene.getRoot());
                // rootItem.getChild("deer").addScript(deer);

                // all entities with button tag now have ButtonComponent
                menuScene.addComponentsByTagName("button", ButtonComponent.class);

                ButtonComponent buttonComponent = rootItem.getChild("settingsBtn").getEntity().getComponent(ButtonComponent.class);
                buttonComponent.addListener(new ButtonComponent.ButtonListener() {
                    public void touchUp() {

            }
            public void touchDown() {
            }
            public void clicked() {
                //loadSceneTest();
             //   SettingsScene.INSTANCE.ShowNow();
            }
        });

        buttonComponent = rootItem.getChild("playBtn").getEntity().getComponent(ButtonComponent.class);
        buttonComponent.addListener(new ButtonComponent.ButtonListener() {
            public void touchUp() {

            }
            public void touchDown() {
            }
            public void clicked() {
                LevelsScene.INSTANCE.ShowNow();
            }
        });
                sceneUI = new MenuUI(menuScene);
    }

    public void ShowNow(){
        SceneManager.INSTANCE.CurrentScene=menuScene;
        sceneUI = new MenuUI(menuScene);
        SceneManager.INSTANCE.sceneUI = sceneUI;
    }
}
