
import { _decorator, Component, Node, Vec3, systemEvent, SystemEventType, EventKeyboard, macro, Prefab, instantiate, RichText, RichTextComponent } from 'cc';
import { Knife } from "./Knife";
import {GameManager} from "db://assets/GameManager";
const { ccclass, property } = _decorator;

@ccclass('Wood')
export class Wood extends Component {
    @property
    acceleration = 50;
    @property
    maxSpeed= 200;
    @property
    startSpeed=50
    @property
    inputTimerLimit= 0.15;

    curSpeed = 0;

    start () {
        this.curSpeed=this.startSpeed;

    }

    update (deltaTime: number) {
        //Game over
        if(GameManager.state == 2) return;

        //speed change
        if(this.acceleration!=0)
        {
            this.curSpeed+=this.acceleration*deltaTime;
            if((this.curSpeed >= 0 && this.curSpeed >= this.maxSpeed))
            {
                this.curSpeed= this.maxSpeed
                this.acceleration*=-1;
            }
            else if((this.curSpeed <= 0 && this.curSpeed <= -this.maxSpeed))
            {
                this.curSpeed= -this.maxSpeed;
                this.acceleration*=-1;
            }
            console.log(this.curSpeed);
        }
        //rotate
        let newRotation = this.node.eulerAngles.z + this.curSpeed * deltaTime;
        this.node.eulerAngles = new Vec3(0, 0, newRotation);
    }


}


