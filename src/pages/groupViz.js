import React, {useState, useEffect} from 'react';
import {Button, Card, } from "react-bootstrap"
import { motion, useAnimation } from "framer-motion"

import { GrRotateLeft } from 'react-icons/gr';
import { CgEditFlipH } from 'react-icons/cg';






export default function GroupViz() {
    var _ = require('lodash');
    const initialMove = {translateX: 650, translateY: 85, transition: {duration: .5,}}

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

    var r0Anim = useAnimation()
    var r0Anim2 = useAnimation()
    var r90Anim = useAnimation()
    var r90Anim2 = useAnimation()
    var r180Anim = useAnimation()
    var r270Anim = useAnimation()
    var r180Anim2 = useAnimation()
    var r270Anim2 = useAnimation()

    var HAnim = useAnimation()
    var VAnim = useAnimation()
    var DAnim = useAnimation()
    var DprimeAnim = useAnimation()
    var HAnim2 = useAnimation()
    var VAnim2 = useAnimation()
    var DAnim2 = useAnimation()
    var DprimeAnim2 = useAnimation()



    const [events, setEvents] = useState({one: D, two: R90})
    const [elem1, setElem1] = useState()
    const [elem2, setElem2] = useState()
    const [resultComp, setResultComp] = useState()
    const [vizReady, setVizReady] = useState(false)


 

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
        await setResultComp(cayleyLookup()[0])

        await anim.start(correctRotation()[0])
        await numberAnimation1.start(correctRotation()[1])    
    }

    async function thirdMove() {
        const result = cayleyLookup()[0]
        
        await anim.start(dismount1)
        
        await anim2.start({translateX: 400, translateY: 85, transition: {duration: .5,}})
        await anim2.start({scale:1.5, transition: {duration: 1, type: "spring"}})

        await animateComposition(result)
        
        await anim2.start(result)
        await numberAnimation2.start(cayleyLookup()[1])

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

        r0Anim.set({translateX: 0, translateY: 0, scale:1})
        r90Anim.set({translateX: 0, translateY: 0, scale:1})
        r180Anim.set({translateX: 0, translateY: 0, scale:1})
        r270Anim.set({translateX: 0, translateY: 0, scale:1})
        HAnim.set({translateX: 0, translateY: 0, scale:1})
        VAnim.set({translateX: 0, translateY: 0, scale:1})
        DAnim.set({translateX: 0, translateY: 0, scale:1})
        DprimeAnim.set({translateX: 0, translateY: 0,scale:1})

        r0Anim2.set({translateX: 0, translateY: 0, scale:1})
        r90Anim2.set({translateX: 0, translateY: 0, scale:1})
        r180Anim2.set({translateX: 0, translateY: 0, scale:1})
        r270Anim2.set({translateX: 0, translateY: 0, scale:1})
        HAnim2.set({translateX: 0, translateY: 0, scale:1})
        VAnim2.set({translateX: 0, translateY: 0, scale:1})
        DAnim2.set({translateX: 0, translateY: 0, scale:1})
        DprimeAnim2.set({translateX: 0, translateY: 0,scale:1})

        setElem1()
        setElem2()
        setEvents({one: {}, two: {}})
        setVizReady(false)
        setResultComp()

        anim.stop()
        anim2.stop()

        numberAnimation1.stop()
        numberAnimation2.stop()
        
        
    }
    // first: -880, 393

    async function animateComposition(elem) {
        var controller; 
        var verticalOffset = 0

        if (_.isEqual(elem, R0)) {
            controller = r0Anim2
            verticalOffset = 0
        } else if (_.isEqual(elem, R90)) {
            controller = r90Anim2
            verticalOffset = 41
        } else if (_.isEqual(elem, R180)) {
            controller = r180Anim2
            verticalOffset = 83
        } else if (_.isEqual(elem, R270)) {
            controller = r270Anim2
            verticalOffset = 124
        } else if (_.isEqual(elem, H)) {
            controller = HAnim2
            verticalOffset = 235
        } else if (_.isEqual(elem, V)) {
            controller = VAnim2
            verticalOffset = 277
        } else if (_.isEqual(elem, D)) {
            controller = DAnim2
            verticalOffset = 318
        } else if (_.isEqual(elem, Dprime)) {
            controller = DprimeAnim2
            verticalOffset = 360
        }

        console.log(resultComp,controller)

        await controller.start({translateX: -341, translateY: 393- verticalOffset, scale:1.2, transition: {duration: 2}})
    }

    function animateElem(verticalOffset, horizontalOffset, elem) {
        var controller; 

        if (_.isEqual(elem, R0)) {
            controller = r0Anim
        } else if (_.isEqual(elem, R90)) {
            controller = r90Anim
        } else if (_.isEqual(elem, R180)) {
            controller = r180Anim
        } else if (_.isEqual(elem, R90)) {
            controller = r90Anim
        } else if (_.isEqual(elem, R270)) {
            controller = r270Anim
        } else if (_.isEqual(elem, H)) {
            controller = HAnim
        } else if (_.isEqual(elem, V)) {
            controller = VAnim
        } else if (_.isEqual(elem, D)) {
            controller = DAnim
        } else if (_.isEqual(elem, Dprime)) {
            controller = DprimeAnim
        }

        controller.start({translateX: horizontalOffset, translateY: 393-verticalOffset})
    }
    function handleAnimation(verticalOffset) {

        var targetElem = {}
        if (verticalOffset === 0) {
            targetElem = R0
        } else if(verticalOffset === 41) {
            targetElem = R90
        }else if(verticalOffset === 83) {
            targetElem = R180
        }else if(verticalOffset === 124) {
            targetElem = R270
        }else if(verticalOffset === 235) {
            targetElem = H
        }else if(verticalOffset === 277) {
            targetElem = V
        }else if(verticalOffset === 318) {
            targetElem = D
        }else if(verticalOffset === 360) {
            targetElem = Dprime
        }


        if (!elem1 && !elem2) {
            console.log("filling first")
            setEvents({one: targetElem, two: {}})
            setElem1(targetElem)
            animateElem(verticalOffset, -880, targetElem)
            // fill elem 1
        } else if (!elem2) {
            console.log("noo")
            // fill elem 2
            setEvents({one: events.one, two: targetElem})
            setElem2(targetElem)
            animateElem(verticalOffset, -610, targetElem)

            setVizReady(true)

        } else {
            console.log(elem1, elem2)
        }

        
        
    }




    return (
        <div className="Page" style={{backgroundColor: "#F5F5F5", }} >
            <div style={{display: "flex", paddingLeft: 20, backgroundColor: "#DCDCDC",}}>
                <h1 style={{fontFamily: "Avenir-light",}}>Visualize Group Theory</h1>
            </div>
            <div style={{paddingLeft: 85, paddingRight: 0, display: "flex", justifyContent: "flex-start", alignItems: "center", flexGrow: 1}}>
                <h1 style={{fontSize: 20,fontFamily: "Avenir-light", }}>Original</h1>
                <h1 style={{position: "absolute", fontSize: 20, fontFamily: "Avenir-light",marginLeft: 520}}>Explore the Symmetries of a Square</h1>
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
                                animate={r0Anim}
                                onTap={() => handleAnimation(0)}

                                whileHover={{scale:1.1}}
                                style={{zIndex: 0, position: "absolute", backgroundColor: "#ffd000",display: "flex", alignItems: "center", justifyContent: "flex-start", width: 170, fontFamily: "Avenir-light", borderRadius: 5 , paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Rotate 0
                                
                            </motion.div>
                            <motion.div
                                animate={r0Anim2}
                                //onTap={() => handleAnimation(0)}

                                whileHover={{scale:1.1}}
                                style={{zIndex: 1, backgroundColor: "#ffd000",display: "flex", alignItems: "center", justifyContent: "flex-start", width: 170, fontFamily: "Avenir-light", borderRadius: 5 , paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Rotate 0
                                
                            </motion.div>
                            <motion.div
                                animate={r90Anim}
                                onTap={() => handleAnimation(41)}                                
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ffd000",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 90
                            </motion.div>
                            <motion.div
                                animate={r90Anim2}
                                //onTap={() => handleAnimation(41)}                                
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffd000",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 90
                            </motion.div>
                            <motion.div
                                animate={r180Anim}
                                onTap={() => handleAnimation(83)}                                

                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ffba00",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                   <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 180
                            </motion.div>
                            <motion.div
                                animate={r180Anim2}
                                //onTap={() => handleAnimation(83)}                                

                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffba00",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                   <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 180
                            </motion.div>
                            <motion.div
                                animate={r270Anim}
                                onTap={() => handleAnimation(124)}    
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ffa500",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                     <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 270
                            </motion.div>
                            <motion.div
                                animate={r270Anim2}
                                //onTap={() => handleAnimation(124)}    
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
                                animate={HAnim}
                                onTap={() => handleAnimation(235)}   
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ff8500",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 ,fontFamily: "Avenir-light", paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Horizontal
                            </motion.div>
                            <motion.div
                                animate={HAnim2}
                                //onTap={() => handleAnimation(235)}   
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff8500",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 ,fontFamily: "Avenir-light", paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Horizontal
                            </motion.div>
                            <motion.div
                                animate={VAnim}
                                onTap={() => handleAnimation(277)}   
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ff7000",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Vertical
                            </motion.div>
                            <motion.div
                                animate={VAnim2}
                                //onTap={() => handleAnimation(277)}   
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff7000",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Vertical
                            </motion.div>
                            <motion.div
                                animate={DAnim}
                                onTap={() => handleAnimation(318)}  
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ff5a00",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Diagonal 1
                            </motion.div>
                            <motion.div
                                animate={DAnim2}
                                //onTap={() => handleAnimation(318)}  
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff5a00",display: "flex", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Diagonal 1
                            </motion.div>
                            <motion.div
                                animate={DprimeAnim}
                                onTap={() => handleAnimation(360)}
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ff4500",display: "flex", justifyContent: "flex-start", alignItems: "center",width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                               Diagonal 2
                            </motion.div>
                            <motion.div
                                animate={DprimeAnim2}
                                //onTap={() => handleAnimation(360)}
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
            <div style= {{justifyContent: "flex-start", alignItems: "center", alignContent: "center", display: "flex", marginLeft: 220, marginTop: 248}}>
                <div style={{fontFamily: "Avenir-light", fontSize: 30}}>
                    Composition: 
                </div>
                <div style={{backgroundColor: "#E8E8E8", marginLeft: 20, marginRight: 30,borderRadius: 10, width: 200, height: 45}}>

                </div>
                <div style={{fontFamily: "Avenir-light", fontSize: 30}}>
                    + 
                </div>
                <div style={{backgroundColor: "#E8E8E8", marginLeft: 20, marginRight: 30,borderRadius: 10, width: 200, height: 45}}>

                </div>
                <div style={{fontFamily: "Avenir-light", fontSize: 30}}>
                    = 
                </div>
                <div style={{backgroundColor: "#E8E8E8", marginLeft: 20, marginRight: 30,borderRadius: 10, width: 200, height: 45}}>

                </div>
            </div>




            <div style={{paddingTop: 20}}>
                <Button onClick={() => completeSequence()}>
                    Animate
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
