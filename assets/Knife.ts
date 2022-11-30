
import { _decorator, Component, Node, RigidBody, director, RigidBody2D, Vec3, Collider2D, IPhysics2DContact, Contact2DType } from 'cc';
import { Wood } from "./Wood";
import {GameManager} from "db://assets/GameManager";
const { ccclass, property } = _decorator;

@ccclass('Knife')
export class Knife extends Component {

    @property({type: RigidBody2D})
    public BodyAnim: RigidBody2D|null = null;


    @property
    state: number = 2;

    @property
    travelSpeed = 400;

    @property({type: Wood})
    public wood: Wood|null = null;

    @property angle: number = 0;

    start () {

        if(this.state !=1) { //normal knife
            this.state = 2;
            this.angle = -this.wood.node.eulerAngles.z;
        }
        else // wood's knife
        {
            this.node.scale= new Vec3(-1,-1,0);
        }
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update (deltaTime: number) {
        //Game Over
        if(GameManager.state == 2) return;

        if (this.state == 1) // on wood
        {

            //let newPosition = new Vec3(this.radiusWood * Math.cos((this.wood.node.eulerAngles.z + this.angle) * 2*Math.PI/360), this.radiusWood * Math.sin((this.wood.node.eulerAngles.z + this.angle) * 2* Math.PI/360), 0);
            this.node.position = GameManager.RotatedPosition(this.angle,this.wood.node.eulerAngles);
            this.node.setRotationFromEuler(GameManager.RotationFromEuler(this.angle,this.wood.node.eulerAngles));
        }
        else if (this.state == 2) // traveling
        {
            let newY = this.node.position.y + deltaTime * this.travelSpeed;
            if (newY > -GameManager.radiusWood)
            {
                newY = -GameManager.radiusWood;
                this.state = 1;
                this.node.scale= new Vec3(-1,-1,0);
                GameManager.Score();
            }
            this.node.position = new Vec3(0, newY, 0);
            this.angle = -this.wood.node.eulerAngles.z - 90;
        }
    }


    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact

        if (this.state == 1 && otherCollider.tag ==1) // knife on wood collider with other knife (tag == 1)
        {
            console.log('onBeginContact' + otherCollider.tag);

            GameManager.GameOver();
        }
    }
}
