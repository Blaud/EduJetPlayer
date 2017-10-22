package com.blaud.edujetjam;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.blaud.edujetjam.Scenes.SceneManager;

public class edujetjam extends ApplicationAdapter {

	@Override
	public void create () {
	}

	@Override
	public void render () {
		Gdx.gl.glClearColor(36/225f, 20/225f, 116/225f, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		SceneManager.INSTANCE.DrawCurrentScene();
	}

	@Override
	public void dispose () {
	}
}

