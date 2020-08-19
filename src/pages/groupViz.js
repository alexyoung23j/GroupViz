import React, {useState, useEffect} from 'react';
import {Button, Card, } from "react-bootstrap"
import { motion, useAnimation } from "framer-motion"

import { GrRotateLeft } from 'react-icons/gr';
import { CgEditFlipH } from 'react-icons/cg';






export default function GroupViz() {
    var _ = require('lodash');
    const initialMove = {translateX: 650, translateY: 50, transition: {duration: .5,}}

    var dismount1 = {translateX: 900,  transition: {duration: 1,}}
    var R0 = {rotate: 0, rotateX: 0, rotateY: 0, transition: {duration: 1}} 
    var R90 = {rotate: -90, rotateX: 0, rotateY: 0,transition: {duration: 1}}
    var R180 = {rotate: -180, rotateX: 0, rotateY: 0,transition: {duration: 1.5}}
    var R270 = {rotate: -270, rotateX: 0, rotateY: 0,transition: {duration: 2}}

    var H = {rotate: 0, rotateY: 0, rotateX: 180, transition: {duration: 1}}
    var V = {rotate: 0, rotateX: 0, rotateY: 180, transition: {duration: 1}}
    var D = { rotate: 90, rotateX: 180, rotateY: 0, transition: {duration: 1.5}}
    var Dprime = { rotate: 90, rotateX: 0, rotateY: 180, transition: {duration: 1.5}}
    

    var anim = useAnimation()
    var anim2 = useAnimation()
    var numberAnimation1 = useAnimation()
    var numberAnimation2 = useAnimation()


    const [events, setEvents] = useState({one: D, two: R90})


 

    const cayley = [[R0, R90, R180, R270, H, V, D, Dprime],
                    [R90, R180, R270, R0, Dprime, D, H, V],
                    [R180, R270, R0, R90, V, H, Dprime, D],
                    [R270, R0, R90, R180, D, Dprime, V, H],
                    [H, D, V, Dprime, R0, R180, R90, R270],
                    [V, Dprime, H, D, R180, R0, R270, R90],
                    [D, V, Dprime, H, R270, R90, R0, R180],
                    [Dprime, H, D, V, R90, R270, R180, R0]]

    const cayleyOrder = [R0, R90, R180, R270, H, V, D, Dprime]

    function indexOfElem(elem) {
        var i;
        for (i=0; i<cayleyOrder.length; i++) {
            if (_.isEqual(elem, cayleyOrder[i])) {
                return i
            }
        }
        return -1
    }
  

    function cayleyLookup() {
        const elem1 = events.one
        const elem2 = events.two

        const elem1Idx = indexOfElem(elem1)
        const elem2Idx = indexOfElem(elem2)


        const result = cayley[elem2Idx][elem1Idx]

        const numberAnim = {rotate: -result.rotate, rotateX: -result.rotateX, rotateY: -result.rotateY, transition: {duration: .5}}

        if (_.isEqual(result, D) || _.isEqual(result, Dprime)) {
            numberAnim.rotateX = numberAnim.rotateX + 180
            numberAnim.rotateY = numberAnim.rotateY+ 180

        }

        return [result, numberAnim]

    }

    function correctRotation() {

        var event1 = events.one
        var event2 = events.two
        var rotX = event1.rotateX
        var rotY = event1.rotateY
        var rotZ = event1.rotate

        var corrected = {rotate:0, rotateX: 0, rotateY: 0, transition: {duration: event2.transition.duration}}

      
        if (_.isEqual(event1, R90) || _.isEqual(event1, R270) || _.isEqual(event1, D) || _.isEqual(event1, Dprime)) {
            corrected.rotate = rotZ + event2.rotate
            corrected.rotateX = rotX + event2.rotateY
            corrected.rotateY = rotY + event2.rotateX
        } else  {
            corrected.rotate = rotZ + event2.rotate
            corrected.rotateX = rotX + event2.rotateX
            corrected.rotateY = rotY + event2.rotateY
        } 

        var numberAnim = {rotate:-corrected.rotate, rotateX: -corrected.rotateX, rotateY: -corrected.rotateY, transition: {duration: .5,}}

        const comp = cayleyLookup()[0]

        if (_.isEqual(comp, D)|| _.isEqual(comp, Dprime)) {
            numberAnim.rotateX = numberAnim.rotateX + 180
            numberAnim.rotateY = numberAnim.rotateY+ 180

        }

        return [corrected, numberAnim]


    }


    async function firstMove() {
        await anim.start(initialMove)
        await anim.start({scale:1.5, transition: {duration: 1, type: "spring"}})

        const event1 = events.one
        await anim.start(event1)
    }

    async function secondMove() {
       
        await anim.start(correctRotation()[0])
        await numberAnimation1.start(correctRotation()[1])      
    }

    async function thirdMove() {
        await anim.start(dismount1)
        await anim2.start({translateX: 400, translateY: 50, transition: {duration: .5,}})
        await anim2.start({scale:1.5, transition: {duration: 1, type: "spring"}})

        
        await anim2.start(cayleyLookup(events)[0])
        await numberAnimation2.start(cayleyLookup(events)[1])

        anim2.start({translateX: 650, transition: {duration: 2}})
        await anim.start({translateX: 650, transition: {duration: 2}})


    }

    async function completeSequence() {

        await firstMove()
        await secondMove()
        await thirdMove()


    }

    function resetAnimations() {

        anim.set({translateX:0, translateY: 0, scale:1, rotate: 0, rotateX: 0, rotateY: 0})
        anim2.set({translateX:0, translateY: 0, scale:1, rotate: 0, rotateX: 0, rotateY: 0})

        numberAnimation1.set({rotate: 0, rotateX: 0, rotateY: 0})
        numberAnimation2.set({rotate: 0, rotateX: 0, rotateY: 0})

        anim.stop()
        anim2.stop()

        numberAnimation1.stop()
        numberAnimation2.stop()
        
        
    }




    return (
        <div className="Page" style={{backgroundColor: "#F5F5F5", }} >
            <div style={{display: "flex", paddingLeft: 20, backgroundColor: "#DCDCDC",}}>
                <h1 style={{fontFamily: "Avenir-light",}}>Visualize Group Theory</h1>
            </div>
            <div style={{paddingLeft: 85, paddingRight: 0, display: "flex", justifyContent: "flex-start", alignItems: "center", flexGrow: 1}}>
                <h1 style={{fontSize: 20,fontFamily: "Avenir-light", }}>Original</h1>
                <h1 style={{fontSize: 20, fontFamily: "Avenir-light",marginLeft: 1150}}>D4 Group Elements</h1>
            </div>
            <div style={{paddingLeft: 25, display: "flex", justifyContent: "flex-start", alignItems: "flex-start"}}>
                <motion.div
                    animate={anim}
                    style={{width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}
                >
                    <motion.div 
                        animate={numberAnimation1}
                        style={{position: "absolute", marginLeft: 10, marginTop: 5, color: "#00008B", fontFamily: "Avenir-light"}}
                    >
                        A
                    </motion.div>
             
                    <motion.div 
                        animate={numberAnimation1}
                        style={{position: "absolute",marginLeft: 180, marginTop: 5, color: "#1E90FF", fontFamily: "Avenir-light"}}
                    >
                        B
                    </motion.div>

                    <motion.div 
                        animate={numberAnimation1}
                        style={{position: "absolute", marginLeft: 10, marginTop: 177, color: "#006400", fontFamily: "Avenir-light"}}
                    >
                        C
                    </motion.div>

                    <motion.div 
                        animate={numberAnimation1}
                        style={{position: "absolute", marginLeft: 180, marginTop: 177, color: "#8B0000", fontFamily: "Avenir-light"}}
                    >
                        D
                    </motion.div>
                </motion.div>

                <motion.div
                    whileHover={{scale: 1.5}}
                    animate={anim2}
                    style={{position: "absolute",width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}
                >
                    <motion.div 
                        animate={numberAnimation2}
                        style={{position: "absolute", marginLeft: 10, marginTop: 5, color: "#00008B", fontFamily: "Avenir-light"}}
                    >
                        A
                    </motion.div>
             
                    <motion.div 
                        animate={numberAnimation2}
                        style={{position: "absolute",marginLeft: 180, marginTop: 5, color: "#1E90FF", fontFamily: "Avenir-light"}}
                    >
                        B
                    </motion.div>

                    <motion.div 
                        animate={numberAnimation2}
                        style={{position: "absolute", marginLeft: 10, marginTop: 177, color: "#006400", fontFamily: "Avenir-light"}}
                    >
                        C
                    </motion.div>

                    <motion.div 
                        animate={numberAnimation2}
                        style={{position: "absolute", marginLeft: 180, marginTop: 177, color: "#8B0000", fontFamily: "Avenir-light"}}
                    >
                        D
                    </motion.div>
                </motion.div>

                <Card style={{position: "absolute", marginLeft: 1220,  borderRadius: 10, backgroundColor: "#DCDCDC", paddingLeft:20, paddingRight: 20, paddingBottom: 30, justifyContent: "center"}}>
                    <Card style={{borderRadius: 10, backgroundColor: "#A9A9A9", paddingLeft: 50, paddingRight: 50, marginTop:20, justifyContent: "center", alignItems: "center"}}>
                        <Card.Body style={{alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                            <div style= {{justifyContent: "center", display: "flex", fontSize: 20, paddingTop: 5, fontFamily: "Avenir-light",paddingBottom: 5}}>
                                Rotations: 
                            </div>
                            <motion.div
                                drag={true}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffd000",display: "flex", alignItems: "center", justifyContent: "flex-start", width: 170, fontFamily: "Avenir-light", borderRadius: 5 , paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Rotate 0
                                
                            </motion.div>
                            <motion.div
                                drag={true}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffd000",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 90
                            </motion.div>
                            <motion.div
                                drag={true}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffba00",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                   <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 180
                            </motion.div>
                            <motion.div
                                drag={true}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffa500",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                     <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 270
                            </motion.div>
                        </Card.Body>
                        
                    </Card>
                    <Card style={{borderRadius: 10, backgroundColor: "#A9A9A9", paddingLeft: 50, paddingRight: 50, marginTop:20, justifyContent: "center", alignItems: "center"}}>
                        <Card.Body style={{alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                            <div style= {{justifyContent: "center", display: "flex", fontSize: 20, paddingTop: 5, fontFamily: "Avenir-light",paddingBottom: 5}}>
                                Reflections: 
                            </div>
                            <motion.div
                                drag={true}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff8500",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 ,fontFamily: "Avenir-light", paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Horizontal
                            </motion.div>
                            <motion.div
                                drag={true}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff7000",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Vertical
                            </motion.div>
                            <motion.div
                                drag={true}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff5a00",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Diagonal 1
                            </motion.div>
                            <motion.div
                                drag={true}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff4500",display: "flex", justifyContent: "flex-start", alignItems: "center",width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                               Diagonal 2
                            </motion.div>
                        </Card.Body>
                        
                    </Card>
                    
                </Card>



                <motion.div  
                    whileHover={{scale:1.1}}
                    style={{position: "absolute", width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}>
                    <div 
                        style={{position: "absolute", marginLeft: 10, marginTop: 5, color: "#00008B", fontFamily: "Avenir-light"}}
                    >
                        A
                    </div>
                    

                    <div 
                        style={{position: "absolute",marginLeft: 180, marginTop: 5, color: "#1E90FF", fontFamily: "Avenir-light"}}
                    >
                        B
                    </div>

                    <div 
                        style={{position: "absolute", marginLeft: 10, marginTop: 177, color: "#006400", fontFamily: "Avenir-light"}}
                    >
                        C
                    </div>

                    <div 
                        style={{position: "absolute", marginLeft: 180, marginTop: 177, color: "#8B0000", fontFamily: "Avenir-light"}}
                    >
                        D
                    </div>
                </motion.div>
              
            </div>
            <div style={{paddingTop: 20}}>
                <Button onClick={() => completeSequence()}>
                    Animate
                </Button>
            </div>

            <div style={{paddingTop: 20}}>
                <Button onClick={() => firstMove()}>
                    first
                </Button>
            </div>

            <div style={{paddingTop: 20}}>
                <Button onClick={() => secondMove()}>
                    second
                </Button>
            </div>

            <div style={{paddingTop: 20}}>
                <Button onClick={() => thirdMove()}>
                    third
                </Button>
            </div>

            <div style={{paddingTop: 20}}>
                <Button onClick={() => resetAnimations()}>
                    reset
                </Button>
            </div>

            <div style={{paddingTop: 20}}>
                <Button onClick={() => {setEvents({one: D,two:V})}}>
                    change
                </Button>
            </div>

            





            
        </div>
  );
}
