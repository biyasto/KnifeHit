
import { Button,_decorator, Component,director, Node, Vec3, systemEvent, SystemEventType, EventKeyboard, macro, Prefab, instantiate, RichText, RichTextComponent } from 'cc';
import { Knife } from "./Knife";
import {Wood} from "./Wood";
const { ccclass, property } = _decorator;


@ccclass('GameManager')
export class GameManager extends Component {

    @property({type: Wood})
    public wood: Wood|null = null;

    @property({type: Node})
    public spawn: Node|null = null;

    @property({type: Node})
    public buttons: Node|null = null;

    @property({type: RichText})
    public  appleText: RichText|null = null;
    @property({type: RichText})
    public  hitText: RichText|null = null;
    @property({type: RichText})
    public  statusText: RichText|null = null;

    @property
    public static state: number = 1; // 1: playing 2: over

    @property({type: Prefab})
    public knifePrefab: Prefab|null = null;

    @property
    public static radiusWood: number =75;

    static GoalScore:number = 5;
    static currentScore:number;
    static appleScore;

    @property
    inputTimerLimit= 0.15;
    inputTimer =0;

    start () {
        GameManager.state = 1;
        if(GameManager.appleScore == null) GameManager.appleScore=0;
        GameManager.currentScore=0;
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    }

    update (deltaTime: number) {
        if (GameManager.state == 1) {
            //input delay timer
            this.inputTimer -= deltaTime;
            this.appleText.string = '<color=#f6b26b>' + GameManager.appleScore.toString() + '</color>';
            this.hitText.string = '<color=#ffffff>' + GameManager.currentScore.toString() + '/' + GameManager.GoalScore.toString() + '</color>';
        }
        else if(GameManager.state == 2){
            this.buttons.active=true;
            this.statusText.string = GameManager.currentScore >= GameManager.GoalScore  ? '<color=#f6b26b>' + 'Complete' + '</color>' : '<color=#f6b26b>' + 'Game Over' + '</color>';
            this.statusText.node.active=true;
        }
    }

    onKeyDown (event: EventKeyboard) {
        switch(event.keyCode) {
            case macro.KEY.a:
                console.log('Press a b key');
                this.ThrowKnife()
                break;
        }
    }

    ThrowKnife()
    {
        if(this.inputTimer<=0)
        {
            if(GameManager.GoalScore == GameManager.currentScore+1) // last knife
                 this.spawn.destroy();

            this.inputTimer=this.inputTimerLimit;
            let newKnife = instantiate(this.knifePrefab);
            newKnife.parent = this.wood.node.parent;
            newKnife.position = this.spawn.position;
            newKnife.getComponent(Knife).wood = this.wood;

        }
    }
    static Score()
    {
        GameManager.currentScore++;
        if(GameManager.currentScore >= GameManager.GoalScore)
        {
            GameManager.GameOver();

        }
    }
    static AppleHit()
    {
        GameManager.appleScore++;
    }
    static RotatedPosition(angle,eulerAngles)
    {
        return new Vec3(GameManager.radiusWood * Math.cos((eulerAngles.z + angle) * 2*Math.PI/360), GameManager.radiusWood * Math.sin((eulerAngles.z + angle) * 2* Math.PI/360), 0);
    }
    static RotationFromEuler(angle,eulerAngles)
    {
        return new Vec3(0, 0, eulerAngles.z + angle - 90);
    }

    static GameOver()
    {
        GameManager.state=2;
    }
    Restart()
    {
        director.loadScene('main-001')
    }

}


