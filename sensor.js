class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 100;
        this.raySpread = Math.PI /2;
        this.rays = [];
        this.readings = [];
    }

    update(roadBorders){
        this.#castRays();
        this.readings = [];
        for (let i=0; i<this.rays.length; i++){
            this.readings.push(
                this.#getReadings(this.rays[i], roadBorders)
            );
        }
    }

    #getReadings(ray, roadBorders){
        let touches = [];
        for (let i=0; i<roadBorders.length; i++){
             const touch = getIntersection(
                // starting point of the ray
                ray[0],
                // ending point of the ray
                ray[1],

                // starting point of the roadBorder 
                roadBorders[i][0],
                // ending point of the roadBorder 
                roadBorders[i][1],
             )
             if (touch){
                touches.push(touch);
             }
        }
        
        //return null if there is no touch 
        if (touches.length==0){
            return null;
        }
        else{
            // loop through each value of the touches and 
            // then return an array of offset from each touch
            const offsets = touches.map(e=>e.offset);
            
            // spread the offsets in many different values 
            // and then get the minimum value from the offset 
            const minOffset = Math.min(...offsets);
            
            //find the touch whose offset is equal to the minOffset
            return touches.find(e=>e.offset == minOffset);
        }
    }

    draw(ctx){

        for(let i=0; i<this.rayCount; i++){
            // this is the ending offset of the ray
            let end = this.rays[i][1];
            
            // if there are readings(i.e intersections happens) then assign readings to end 
            if (this.readings[i]){
                 end = this.readings[i];
            }

            //draw a ray from start till end 
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();            
            
            // if intercection happens then change the color of the ray to the point till the intersection happend
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

        }
    }

    #castRays(){
        this.rays = [];
        for (let i=0; i<this.rayCount; i++){
            const rayAngle =  lerp(
                this.raySpread/2,
                -this.raySpread/2,
                (this.rayCount==1) ? 0.5 : i/(this.rayCount -1)
            ) + this.car.angle;
            const start ={x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - 
                    Math.sin(rayAngle)*this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle)*this.rayLength
            };

            this.rays.push([start,end])
        }
    }
}