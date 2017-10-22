package com.blaud.edujetjam.Scenes.uiStages;

import com.badlogic.ashley.core.Entity;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g2d.ParticleEffect;
import com.badlogic.gdx.graphics.g2d.ParticleEmitter;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Table;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.viewport.StretchViewport;
import com.blaud.edujetjam.Scenes.GameScene;
import com.blaud.edujetjam.Scenes.MenuScene;
import com.uwsoft.editor.renderer.SceneLoader;
import com.uwsoft.editor.renderer.components.additional.ButtonComponent;
import com.uwsoft.editor.renderer.data.CompositeItemVO;
import com.uwsoft.editor.renderer.data.ParticleEffectVO;
import com.uwsoft.editor.renderer.scene2d.CompositeActor;
import com.uwsoft.editor.renderer.utils.ItemWrapper;

/**
 * Created by blaud on 21.09.2016.
 */
public class LevelsUI extends Stage {
        public LevelsUI(SceneLoader sceneLoader) {
        super(new StretchViewport(800, 480));
        Gdx.input.setInputProcessor(this);
        Table mainUITable = new Table();
        mainUITable.setFillParent(true);

        Table topUI = new Table();
        Table bottomUI = new Table();



                //first 4 scenes are not lvl scenes
                for (int i = 6;i<=sceneLoader.getRm().getProjectVO().scenes.size();i++){
                                CompositeActor button = new CompositeActor(sceneLoader.loadVoFromLibrary("lvlbtn"), sceneLoader.getRm());
                                button.setX(getWidth() - button.getWidth());
                                button.setY(getHeight() - button.getHeight());
//                                button.addListener(new ClickListener() {
//                                        public void clicked(InputEvent event, float x, float y) {
//                                                // Do some stuff
//                                        }
//                                });
                                Label valueLbl = (Label)button.getItemsByLayer("text").get(0);
                                 valueLbl.setText(i-5+"");
                               /*      button.addListener(new ButtonComponent.ButtonListener() {
                                    public void touchUp() {

                                    }
                                    public void touchDown() {
                                    }
                                    public void clicked() {
                                        //loadSceneTest();
                                        //   SettingsScene.INSTANCE.ShowNow();
                                    }
                                });*/

                                   //
                                    //add entity from lib
                                  //
                                /*CompositeItemVO test = button.getVo();
                                test.x = 0;
                                test.y = 0;
                                Entity en = sceneLoader.entityFactory.createEntity(sceneLoader.getRoot(), test);
                                sceneLoader.entityFactory.initAllChildren(sceneLoader.getEngine(), en, test.composite);
                                sceneLoader.getEngine().addEntity(en);*/


                                button.addListener(new ClickListener() {
                                    public void clicked (InputEvent event, float x, float y) {
                                       // String lvlname = "lvl"+((Label)((CompositeActor) event.getListenerActor()).getItemsByLayer("text").get(0)).getText();
                                        GameScene.INSTANCE.ShowGame(("lvl"+((Label)((CompositeActor) event.getListenerActor()).getItemsByLayer("text").get(0)).getText()));

                                    }
                                });

                                topUI.add(button).padTop(10);

                        if((i%4==0)||((i==sceneLoader.getRm().getProjectVO().scenes.size())&&
                                (sceneLoader.getRm().getProjectVO().scenes.size()-5)%4!=0)){
                                mainUITable.add(topUI).expandX();
                                mainUITable.row();
                                topUI = new Table();
                        }
                }

            //add Back button
            CompositeActor button = new CompositeActor(sceneLoader.loadVoFromLibrary("backbtn"), sceneLoader.getRm());
            button.setX(getWidth() - button.getWidth());
            button.setY(getHeight() - button.getHeight());
            button.addListener(new ClickListener() {
                public void clicked(InputEvent event, float x, float y) {
                    MenuScene.INSTANCE.ShowNow();
                }
            });
            bottomUI.add(button);

                mainUITable.add(bottomUI).left().bottom().expandX();
                addActor(mainUITable);
        }

}
