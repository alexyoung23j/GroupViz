import React, {useState} from 'react';
import {Card, Button} from "react-bootstrap"
import { motion, useAnimation } from "framer-motion"



export default function GroupViz() {

    const [test, setTest] = useState(false)
    

    const anim = useAnimation()
    const anim2 = useAnimation()
    const numberAnimation1 = useAnimation()
    const numberAnimation2 = useAnimation()



    const initialMove = {translateX: 700, translateY: 50, transition: {duration: .5,}}

    const dismount1 = {translateX: 900,  transition: {duration: 1,}}
    const R0 = {rotate: 0, rotateX: 0, rotateY: 0, transition: {duration: 1}}
    const R90 = {rotate: -90, rotateX: 0, rotateY: 0,transition: {duration: 1}}
    const R180 = {rotate: -180, rotateX: 0, rotateY: 0,transition: {duration: 1.5}}
    const R270 = {rotate: -270, rotateX: 0, rotateY: 0,transition: {duration: 2}}

    const H = {rotate: 0, rotateY: 0, rotateX: 180, transition: {duration: 1}}
    const V = {rotate: 0, rotateX: 0, rotateY: 180, transition: {duration: 1}}
    const D = { rotate: 90, rotateX: 180, rotateY: 0, transition: {duration: 1.5} }
    const Dprime = { rotate: 90, rotateX: 0, rotateY: 180, transition: {duration: 1.5}}


    const cayley = [[R0, R90, R180, R270, H, V, D, Dprime],
                    [R90, R180, R270, R0, Dprime, D, H, V],
                    [R180, R270, R0, R90, V, H, Dprime, D],
                    [R270, R0, R90, R180, D, Dprime, V, H],
                    [H, D, V, Dprime, R0, R180, R90, R270],
                    [V, Dprime, H, D, R180, R0, R90, R270],
                    [D, V, Dprime, H, R270, R90, R0, R180],
                    [Dprime, H, D, V, R90, R270, R180, R0]]

    const cayleyOrder = [R0, R90, R180, R270, H, V, D, Dprime]

    function cayleyLookup(composition) {
        const elem1 = composition[0]
        const elem2 = composition[1]


        const elem1Idx = cayleyOrder.indexOf(elem1)
        const elem2Idx = cayleyOrder.indexOf(elem2)


        const result = cayley[elem2Idx][elem1Idx]

        const numberAnim = {rotate: -result.rotate, rotateX: -result.rotateX, rotateY: -result.rotateY, transition: {duration: .5}}

        if (result === D || result === Dprime) {
            numberAnim.rotateX = numberAnim.rotateX + 180
            numberAnim.rotateY = numberAnim.rotateY+ 180

        }

        return [result, numberAnim]

    }

    function correctRotation(event1, event2) {

        const rotX = event1.rotateX
        const rotY = event1.rotateY
        const rotZ = event1.rotate

        const corrected = {rotate:0, rotateX: 0, rotateY: 0, transition: {duration: event2.transition.duration}}

        if (event1 === R90 || event1 === R270 || event1 === D || event1 === Dprime) {
            corrected.rotate = rotZ + event2.rotate
            corrected.rotateX = rotX + event2.rotateY
            corrected.rotateY = rotY + event2.rotateX
        } else if (event1 === R0 || event1 === R180 || event1 === H || event1 === V) {
            corrected.rotate = rotZ + event2.rotate
            corrected.rotateX = rotX + event2.rotateX
            corrected.rotateY = rotY + event2.rotateY
        } 

        const numberAnim = {rotate:-corrected.rotate, rotateX: -corrected.rotateX, rotateY: -corrected.rotateY, transition: {duration: .5,}}

        const comp = cayleyLookup([event1, event2])[0]

        if (comp === D || comp === Dprime) {
            numberAnim.rotateX = numberAnim.rotateX + 180
            numberAnim.rotateY = numberAnim.rotateY+ 180

        }

        return [corrected, numberAnim]


    }

    const events = [R90, V]

    async function firstMove(events) {
        await anim.start(initialMove)
        await anim.start({scale:1.5, transition: {duration: 1, type: "spring"}})

        const event1 = events[0]
        const event2 = events[1]
        await anim.start(event1)
    }

    async function secondMove(events) {

        const event1 = events[0]
        const event2 = events[1]
        await anim.start(correctRotation(event1, event2)[0])
        await numberAnimation1.start(correctRotation(event1, event2)[1])      
    }

    async function thirdMove(events) {
        const event1 = events[0]
        const event2 = events[1]
        await anim.start(dismount1)
        await anim2.start({translateX: 400, translateY: 50, transition: {duration: .5,}})
        await anim2.start({scale:1.5, transition: {duration: 1, type: "spring"}})

        
        await anim2.start(cayleyLookup(events)[0])
        await numberAnimation2.start(cayleyLookup(events)[1])

        anim2.start({translateX: 670, transition: {duration: 2}})
        await anim.start({translateX: 670, transition: {duration: 2}})

    }

    async function completeSequence(events) {

        await firstMove(events)
        await secondMove(events)
        await thirdMove(events)
    }





    return (
        <div className="Page" >
            <div style={{display: "flex", paddingLeft: 20, backgroundColor: "#DCDCDC"}}>
                <h1 style={{}}>Visualize Group Theory</h1>
            </div>
            <div style={{paddingLeft: 85, paddingRight: 85, display: "flex", justifyContent: "space-between", alignItems: "center",}}>
                <h1 style={{fontSize: 20}}>Original</h1>
                <h1 style={{fontSize: 20}}>D4 Group Elements</h1>
            </div>
            <div style={{paddingLeft: 25, paddingTop: 25, display: "flex", justifyContent: "flex-start", alignItems: "center",}}>
                <motion.div
                    whileHover={{scale:1.7}}
                    animate={anim}
                    style={{width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}
                >
                    <motion.div 
                        animate={numberAnimation1}
                        style={{position: "absolute", marginLeft: 10, marginTop: 5, color: "#00008B"}}
                    >
                        A
                    </motion.div>
             
                    <motion.div 
                        animate={numberAnimation1}
                        style={{position: "absolute",marginLeft: 180, marginTop: 5, color: "#1E90FF"}}
                    >
                        B
                    </motion.div>

                    <motion.div 
                        animate={numberAnimation1}
                        style={{position: "absolute", marginLeft: 10, marginTop: 177, color: "#006400"}}
                    >
                        C
                    </motion.div>

                    <motion.div 
                        animate={numberAnimation1}
                        style={{position: "absolute", marginLeft: 180, marginTop: 177, color: "#8B0000"}}
                    >
                        D
                    </motion.div>
                </motion.div>

                <motion.div
                    whileHover={{scale:1.7}}
                    animate={anim2}
                    style={{position: "absolute",width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}
                >
                    <motion.div 
                        animate={numberAnimation2}
                        style={{position: "absolute", marginLeft: 10, marginTop: 5, color: "#00008B"}}
                    >
                        A
                    </motion.div>
             
                    <motion.div 
                        animate={numberAnimation2}
                        style={{position: "absolute",marginLeft: 180, marginTop: 5, color: "#1E90FF"}}
                    >
                        B
                    </motion.div>

                    <motion.div 
                        animate={numberAnimation2}
                        style={{position: "absolute", marginLeft: 10, marginTop: 177, color: "#006400"}}
                    >
                        C
                    </motion.div>

                    <motion.div 
                        animate={numberAnimation2}
                        style={{position: "absolute", marginLeft: 180, marginTop: 177, color: "#8B0000"}}
                    >
                        D
                    </motion.div>
                </motion.div>



                <motion.div  
                    whileHover={{scale:1.2}}
                    style={{position: "absolute", width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}>
                    <div 
                        style={{position: "absolute", marginLeft: 10, marginTop: 5, color: "#00008B"}}
                    >
                        A
                    </div>
                    

                    <div 
                        style={{position: "absolute",marginLeft: 180, marginTop: 5, color: "#1E90FF"}}
                    >
                        B
                    </div>

                    <div 
                        style={{position: "absolute", marginLeft: 10, marginTop: 177, color: "#006400"}}
                    >
                        C
                    </div>

                    <div 
                        style={{position: "absolute", marginLeft: 180, marginTop: 177, color: "#8B0000"}}
                    >
                        D
                    </div>
                </motion.div>
              
            </div>
            <div style={{paddingTop: 20}}>
                <Button onClick={() => completeSequence(events)}>
                    Animate
                </Button>
            </div>

            <div style={{paddingTop: 20}}>
                <Button onClick={() => firstMove(events)}>
                    first
                </Button>
            </div>

            <div style={{paddingTop: 20}}>
                <Button onClick={() => secondMove(events)}>
                    second
                </Button>
            </div>

            <div style={{paddingTop: 20}}>
                <Button onClick={() => thirdMove(events)}>
                    third
                </Button>
            </div>


            
        </div>
  );
}
