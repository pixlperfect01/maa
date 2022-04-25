function getTime(city){
    return city.simulation.time.timeSinceStart;
}

function isDay(city){
    var t = Math.floor(getTime(city) / 60) % 24;
    if(t > 6 && t < 18){
        return true;
    }
    return false;
}

var GLOBALS = {};
GLOBALS.dmMult = 1;

(function(ef){
    var highlights = ef();
    if(this.currentGoal == null) {
        return [];
    }
    var _g = 0;
    var _g1 = this.currentGoal.subGoals;
    while(_g < _g1.length) {
        var subGoal = _g1[_g];
        ++_g;
        if(!this.subGoalComplete(subGoal)) {
            var _g2 = subGoal.type;
            switch(_g2) {
            case "ClickBuilding":
                var clickBuildingGoal = subGoal;
                var className = clickBuildingGoal.permanentToClickClass;
                if(!StringTools.startsWith(className,"buildings.") && !StringTools.startsWith(className,"worldResources.")) {
                    className = "buildings." + className;
                }
                highlights.push(Type.resolveClass(className));
                break;
            }
        }
    }
    return highlights;
})(progress_Story.getDesiredGoalHighlights);

(function(ef){
    subGoalComplete: function(goal) {
		var _g = goal.type;
		switch(_g) {
    		case "ClickBuilding":
    			var clickBuildingGoal = goal;
    			var className = clickBuildingGoal.permanentToClickClass;
    			if(!StringTools.startsWith(className,"buildings.") && !StringTools.startsWith(className,"worldResources.")) {
    				className = "buildings." + className;
    			}
                var findFunc = function(pm){
                    return pm["is"](Type.resolveClass(className));
                }
                var pm1 = Lambda.find(this.city.permanents, findFunc);
                if(this.city.gui.windowRelatedTo == pm1){
                    return true;
                }
        }
        return ef();
})();

const CH = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM[]{};:'\"\\=-+_!@#$%^&*()1234567890`~,.<>/?|"

ModTools.makeBuilding('OverfluxOrb', (superClass) => {  return {
    update: function(timeMod) {
        if(this.currentEvent == null){
            if(Math.random() < 0.05 && Math.floor(getTime(this.city) / 60) % 24 == 0){
                this.beginEvent();
            }
        } else {
            this.tickEvent(timeMod);
        }
    }
    ,updateAnimation: function(timeMod){
        var mainAnimSpeed = 4;
		var maxWaitTime = 180;
		var beginAnimTime = 480;
		var animLength = this.bgTextures.length * mainAnimSpeed * 2 + beginAnimTime + maxWaitTime;
		this.animProgress = (this.animProgress + timeMod) % animLength;
		if(this.animProgress < beginAnimTime) {
			this.backSprite.texture = this.bgTextures[(Math.floor(this.animProgress) / 4 | 0) % 2];
		} else if(this.animProgress - beginAnimTime - maxWaitTime > this.bgTextures.length * mainAnimSpeed) {
			var val = this.bgTextures.length - 1 - (Math.floor(this.animProgress - this.bgTextures.length * mainAnimSpeed - beginAnimTime - maxWaitTime) / mainAnimSpeed | 0);
			var maxVal = this.bgTextures.length - 1;
			this.backSprite.texture = this.bgTextures[val < 0 ? 0 : val > maxVal ? maxVal : val];
		} else if(this.animProgress - beginAnimTime > this.bgTextures.length * mainAnimSpeed) {
			this.backSprite.texture = this.bgTextures[this.bgTextures.length - 1];
		} else {
			var val1 = Math.floor(this.animProgress - beginAnimTime) / mainAnimSpeed | 0;
			var maxVal1 = this.bgTextures.length - 1;
			this.backSprite.texture = this.bgTextures[val1 < 0 ? 0 : val1 > maxVal1 ? maxVal1 : val1];
		}
    }
    ,beginEvent: function(){
        this.currentEvent = Math.floor(Math.random()*1);
        this.setupEvent(this.currentEvent);
    }
    ,setupEvent: function(e){
        switch(e){
            case 0:
                this.currentEventData = {
                    duration: 60*24
                };
                break;
        }
    }
    ,addWindowInfoLines: function() {
		var _gthis = this;
        superClass.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
            var o = "";
            for(var i = 0; i < 20; i++){
                o += CH.charAt(Math.floor(Math.random()*CH.length));
            }
            return o;
		});
        
	}
    ,tickEvent: function(timeMod){
        this.currentEventData.duration -= timeMod;
        if(this.currentEventData.duration <= 0){
            switch(this.currentEvent){
                case 0:
                    GLOBALS.dmMult = 1;
                    break;
            }
            this.currentEvent = null;
            this.currentEventData = {};
            return;
        }
        switch(this.currentEvent){
            case 0:
                var t = ((Math.floor(getTime(this.city)) % (60*24)) / (60*24)) * 2*Math.PI;
                var m = Math.sin(t)*1.5+2.5; // m is between 1 and 4
                GLOBALS.dmMult = m;
                break;
        }
    }
    ,createWindowAddBottomButtons: function() {
        this.city.gui.windowAddBottomButtons();
    }
	,positionSprites: function() {
		superClass.prototype.positionSprites.call(this);
		if(this.backSprite != null) {
			this.backSprite.position.set(this.position.x,this.position.y);
		}
	}
    ,__constructor__: function(game,stage,bgStage,city,world,position,worldPosition,id){
        this.currentEvent = null;
        this.currentEventData = {};
        superClass.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
        this.bgTextures = Resources.getTexturesByWidth("spr_overflux_orb_frames",20);
        this.backSprite = new PIXI.Sprite(this.bgTextures[0]);
        this.backSprite.position.set(position.x,position.y);
        bgStage.addChild(this.backSprite);
	    this.animProgress = 0;
    }
};}, 'spr_overflux_orb', (queue) => {
    queue.addByte(this.currentEvent);
    queue.addFloat(this.currentEventData.duration);
}, (queue) => {
    this.currentEvent = queue.readByte();
    this.currentEvent.duration = queue.readFloat();
}, Building);




ModTools.makeBuilding("ResearchCenter", (superClass) => {
    
}, "spr_potion_brewery", (queue) => {
    
}, (queue) => {
    
}, buildings_Work);

ModTools.makeBuilding("TheArchives", (superClass) => {
    
}, "spr_archives", (queue) => {
    
}, (queue) => {
    
}, Building);