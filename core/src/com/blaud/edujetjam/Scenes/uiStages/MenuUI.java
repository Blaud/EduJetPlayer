package com.blaud.edujetjam.Scenes.uiStages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Table;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.utils.viewport.StretchViewport;
import com.blaud.edujetjam.Scenes.MenuScene;
import com.uwsoft.editor.renderer.SceneLoader;
import com.uwsoft.editor.renderer.scene2d.CompositeActor;

/**
 * Created by blaud on 21.09.2016.
 */
public class MenuUI extends Stage {
    public MenuUI(SceneLoader sceneLoader) {
        super(new StretchViewport(800, 480));

        Gdx.input.setInputProcessor(this);
        Table mainUITable = new Table();
        mainUITable.setFillParent(true);

        Table topUI = new Table();
        Table bottomUI = new Table();

        mainUITable.add(topUI).expandX();
        mainUITable.row();
        mainUITable.add(bottomUI).expand();

        addActor(mainUITable);
    }

}
