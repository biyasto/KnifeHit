import {_decorator, Collider2D, Component, Contact2DType, director, IPhysics2DContact, RigidBody2D, Vec3} from 'cc';
import {Wood} from "./Wood";
import {GameManager} from "db://assets/GameManager";

const { ccclass, property } = _decorator;


@ccclass('Apple')
export class Apple extends Component {
    @property({type: RigidBody2D})
    public BodyAnim: RigidBody2D|null = null;

    @property({type: Wood})
    public wood: Wood|null = null;

    @property
    public state: number = 1;

    @property angle: number = 0;



    despawnTimer=3;
    start () {
        // [3]
        this.state = 1;
        //console.log(-this.wood.node.eulerAngles.z)

        let collider = this.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update (deltaTime: number) {
        //Game over
        if(GameManager.state == 2) return;

        if (this.state == 1) // on wood
        {
            this.node.position = GameManager.RotatedPosition(this.angle,this.wood.node.eulerAngles);
            this.node.setRotationFromEuler(GameManager.RotationFromEuler(this.angle,this.wood.node.eulerAngles));
        }
        else
            if (this.state == 2) // falling
        {
            this.despawnTimer-=deltaTime;
            if(this.despawnTimer<0) this.node.destroy();
            this.node.position = new Vec3(0,this.node.position.y-300*deltaTime,0);

        }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact

        if (this.state == 1 && otherCollider.tag ==1) // knife on wood collider with other knife (tag == 1)
        {

            console.log('apple is hit')
            GameManager.AppleHit();
            this.state=2;

        }

    }
}

