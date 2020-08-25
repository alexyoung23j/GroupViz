import React, {useState, useEffect, useRef} from 'react';
import {Button, Card, } from "react-bootstrap"
import { motion, useAnimation, AnimatePresence } from "framer-motion"

import { GrRotateLeft } from 'react-icons/gr';
import { CgEditFlipH } from 'react-icons/cg';
import { AiFillPlayCircle} from "react-icons/ai"
 





export default function GroupViz() {
    var _ = require('lodash');

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)


    const initialMove = {translateX: windowWidth*.38, translateY: 85, transition: {duration: .5,}}

    var dismount1 = {translateX: windowWidth*.55,  transition: {duration: 1,}}
    var R0 = {rotate: 0, rotateX: 0, rotateY: 0, scale: [1.5, 1.6, 1.5], transition: {duration: 1}} 
    var R90 = {rotate: -90, rotateX: 0, rotateY: 0,transition: {duration: 1.5}}
    var R180 = {rotate: -180, rotateX: 0, rotateY: 0,transition: {duration: 2}}
    var R270 = {rotate: -270, rotateX: 0, rotateY: 0,transition: {duration: 2.5}}

    var H = {rotate: 0, rotateY: 0, rotateX: 180, transition: {duration: 1.5}}
    var V = {rotate: 0, rotateX: 0, rotateY: 180, transition: {duration: 1.5}}
    var D = { rotate: 90, rotateX: 180, rotateY: 0, transition: {duration: 2}}
    var Dprime = { rotate: 90, rotateX: 0, rotateY: 180, transition: {duration: 2}}
    
    var playAnim = useAnimation()
    var origAnim = useAnimation()
    var resetAnim = useAnimation()

    var anim = useAnimation()
    var anim2 = useAnimation()
    var numberAnimation1 = useAnimation()
    var numberAnimation2 = useAnimation()
    var info = useAnimation()

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


    const comp1Ref = useRef()
    const comp2Ref = useRef()
    const compResultRef = useRef()

    const r0Ref = useRef()
    const r90Ref = useRef()
    const r180Ref = useRef()
    const r270Ref = useRef()

    const HRef = useRef()
    const VRef = useRef()
    const DRef = useRef()
    const DprimeRef = useRef()

    const [events, setEvents] = useState()
    const [elem1, setElem1] = useState()
    const [elem1Control, setElem1Control] = useState()
    const [elem2, setElem2] = useState()
    const [elem2Control, setElem2Control] = useState()
    const [animUnfinished, setAnimUnfinished] = useState(true)
    const [resultComp, setResultComp] = useState()

    
    const [initialMessage, setInitialMessage] = useState(true)

 

    const cayley = [[R0, R90, R180, R270, H, V, D, Dprime],
                    [R90, R180, R270, R0, Dprime, D, H, V],
                    [R180, R270, R0, R90, V, H, Dprime, D],
                    [R270, R0, R90, R180, D, Dprime, V, H],
                    [H, D, V, Dprime, R0, R180, R90, R270],
                    [V, Dprime, H, D, R180, R0, R270, R90],
                    [D, V, Dprime, H, R270, R90, R0, R180],
                    [Dprime, H, D, V, R90, R270, R180, R0]]

    const cayleyOrder = [R0, R90, R180, R270, H, V, D, Dprime]

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth)
            setWindowHeight(window.innerHeight)
        })
     
    }, [])

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
        playAnim.start({opacity: .5, transition: {duration: 1}})
        anim2.set({opacity: 0})
        origAnim.set({opacity: .7, transition: {duration: 1}})

        info.set({opacity: 0.5})
        r0Anim.set({opacity: 0.5})
        r90Anim.set({opacity: 0.5})
        r180Anim.set({opacity: 0.5})
        r270Anim.set({opacity: 0.5})
        HAnim.set({opacity: 0.5})
        VAnim.set({opacity: 0.5})
        DAnim.set({opacity: 0.5})
        DprimeAnim.set({opacity: 0.5})

        r0Anim2.set({opacity: 0.5})
        r90Anim2.set({opacity: 0.5})
        r180Anim2.set({opacity: 0.5})
        r270Anim2.set({opacity: 0.5})
        HAnim2.set({opacity: 0.5})
        VAnim2.set({opacity: 0.5})
        DAnim2.set({opacity: 0.5})
        DprimeAnim2.set({opacity: 0.5})

        setAnimUnfinished(false)


        await anim.start(initialMove)
        await anim.start({scale:1.5, transition: {duration: 1, type: "spring"}})
        await elem1Control.start({scale:1.2, opacity: 1, transition: {duration: 1.5, type: "spring", loop: "infinity"}})

        const event1 = events.one
        await anim.start(event1)
        await elem1Control.start({scale:1, transition: {duration: .5, type: "spring"}})
    }

    async function secondMove() {
        await setResultComp(cayleyLookup()[0])
        await elem2Control.start({scale:1.2, opacity:1, transition: {duration: 1.5, type: "spring", loop: "infinity"}})

        await anim.start(correctRotation()[0])
        await numberAnimation1.start(correctRotation()[1])    
        await elem2Control.start({scale:1, transition: {duration: .5, type: "spring"}})
        anim.start({opacity: 0.7, transition: {duration: 1}})

    }

    async function thirdMove() {
        const result = cayleyLookup()[0]
        await anim2.start({opacity: 1, transition: {duration: .1}})

        
        await anim.start(dismount1)
        
        await anim2.start({translateX: windowWidth*.25, translateY: 85, transition: {duration: .5,}})
        await anim2.start({scale:1.5, transition: {duration: 1, type: "spring"}})

        await animateComposition(result)
        
        await anim2.start(result)
        await numberAnimation2.start(cayleyLookup()[1])

        anim2.start({translateX: windowWidth*.38, transition: {duration: 2}})
        anim.start({opacity: 1, transition: {duration: 1}})

        await anim.start({translateX: windowWidth*.38, transition: {duration: 2}})
        await anim2.start({scale: 1.6, transition: {duration: 1, type: "spring"}})

        resetAnim.start({scale: [1, 1.2, 1], transition: {duration:1,  loop: Infinity}})


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

        playAnim.set({opacity: 0.5, scale:1 })

        info.set({opacity: 1})
        resetAnim.set({scale:1})


        r0Anim.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        r90Anim.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        r180Anim.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        r270Anim.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        HAnim.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        VAnim.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        DAnim.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        DprimeAnim.set({translateX: 0, translateY: 0,scale:1, opacity: 1})

        r0Anim2.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        r90Anim2.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        r180Anim2.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        r270Anim2.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        HAnim2.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        VAnim2.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        DAnim2.set({translateX: 0, translateY: 0, scale:1, opacity: 1})
        DprimeAnim2.set({translateX: 0, translateY: 0,scale:1, opacity: 1})

        setElem1Control()
        setElem2Control()

        setElem1()
        setElem2()
        setEvents({one: {}, two: {}})
        setResultComp()

        anim.stop()
        anim2.stop()
        setAnimUnfinished(true)

        numberAnimation1.stop()
        numberAnimation2.stop()
        
        
    }
    // first: -880, 393

    async function animateComposition(elem) {
        var controller; 
        var elemRef;

        if (_.isEqual(elem, R0)) {
            controller = r0Anim2
            elemRef = r0Ref
        } else if (_.isEqual(elem, R90)) {
            controller = r90Anim2
            elemRef = r90Ref
        } else if (_.isEqual(elem, R180)) {
            controller = r180Anim2
            elemRef = r180Ref
        } else if (_.isEqual(elem, R270)) {
            controller = r270Anim2
            elemRef = r270Ref
        } else if (_.isEqual(elem, H)) {
            controller = HAnim2
            elemRef = HRef
        } else if (_.isEqual(elem, V)) {
            controller = VAnim2
            elemRef = VRef
        } else if (_.isEqual(elem, D)) {
            controller = DAnim2
            elemRef = DRef
        } else if (_.isEqual(elem, Dprime)) {
            controller = DprimeAnim2
            elemRef = DprimeRef
        }


        await controller.start({opacity:1, translateX: (compResultRef.current.offsetLeft- elemRef.current.offsetLeft) +15, translateY: (compResultRef.current.offsetTop - elemRef.current.offsetTop) + 4,transition: {duration: 1}})
        await controller.start({scale:1.2, transition: {duration:1, type: "spring"}})
    }

    function animateElem(compRef, elem, elemNum) {
        setInitialMessage(false)
        var controller; 
        var elemRef;

        if (_.isEqual(elem, R0)) {
            controller = r0Anim
            elemRef = r0Ref
        } else if (_.isEqual(elem, R90)) {
            controller = r90Anim
            elemRef = r90Ref

        } else if (_.isEqual(elem, R180)) {
            controller = r180Anim
            elemRef = r180Ref

        } else if (_.isEqual(elem, R270)) {
            controller = r270Anim
            elemRef = r270Ref

        } else if (_.isEqual(elem, H)) {
            controller = HAnim
            elemRef =  HRef

        } else if (_.isEqual(elem, V)) {
            controller = VAnim
            elemRef = VRef

        } else if (_.isEqual(elem, D)) {
            controller = DAnim
            elemRef = DRef

        } else if (_.isEqual(elem, Dprime)) {
            controller = DprimeAnim
            elemRef = DprimeRef

        }

        if (elemNum === 1) {
            setElem1Control(controller)
        } else {
            setElem2Control(controller)
        }

        controller.start({translateX: (compRef.current.offsetLeft- elemRef.current.offsetLeft) +15 , translateY: (compRef.current.offsetTop - elemRef.current.offsetTop) + 4})
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
            setEvents({one: targetElem, two: {}})
            setElem1(targetElem)
            animateElem(comp1Ref, targetElem, 1)
            // fill elem 1
        } else if (!elem2) {
            // fill elem 2
            setEvents({one: events.one, two: targetElem})
            setElem2(targetElem)
            animateElem(comp2Ref, targetElem, 2)
            playAnim.start({opacity: 1, scale: 1.1, transition: {duration: .5}})
        } 

        
        
    }

    function handleStart() {
        if (elem1 && elem2 && animUnfinished) {
            completeSequence()
        }
    }

    function squares() {
        return (        
            <div >
            
             {/* First Animated Square */}
             <motion.div
                animate={anim}
                style={{position: "absolute", width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}
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

            {/* Second Animated Square */}
            <motion.div
                
                animate={anim2}
                style={{position: "absolute", width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}
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
            <motion.div  
                whileHover={{scale:1.1}}
                animate={origAnim}
                style={{width: '200px', height: "200px", backgroundColor: "orange",  borderRadius: 10, display: "flex", borderWidth: "10px",}}>
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
        )
    }

    function elements() {
        return (
            <div >
                <Card style={{borderRadius: 10, backgroundColor: "#DCDCDC", paddingLeft:20, paddingRight: 20, paddingBottom: 18, paddingTop: 1, justifyContent: "center"}}>
                    <Card style={{borderRadius: 10, backgroundColor: "#A9A9A9", paddingLeft: 50, paddingRight: 50, marginTop:20, justifyContent: "center", alignItems: "center"}}>
                        <Card.Body style={{alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                            <div style= {{justifyContent: "center", display: "flex", fontSize: 20, paddingTop: 5, fontFamily: "Avenir-light",paddingBottom: 1}}>
                                Rotations: 
                            </div>
                            <motion.div
                                animate={r0Anim}
                                onTap={() => handleAnimation(0)}
                                ref={r0Ref}
                                whileHover={{scale:1.1}}
                                style={{zIndex: 0, position: "absolute", backgroundColor: "#ffd000",display: "flex", cursor: "pointer", alignItems: "center", justifyContent: "flex-start", width: 170, fontFamily: "Avenir-light", borderRadius: 5 , paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Rotate 0
                                
                            </motion.div>
                            <motion.div
                                animate={r0Anim2}
                                //onTap={() => handleAnimation(0)}

                                whileHover={{scale:1.1}}
                                style={{zIndex: 1, backgroundColor: "#ffd000",display: "flex", alignItems: "center", cursor: "pointer",justifyContent: "flex-start", width: 170, fontFamily: "Avenir-light", borderRadius: 5 , paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Rotate 0
                                
                            </motion.div>
                            <motion.div
                                animate={r90Anim}
                                onTap={() => handleAnimation(41)} 
                                ref={r90Ref}                               
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ffd000",display: "flex", cursor: "pointer",justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 90
                            </motion.div>
                            <motion.div
                                animate={r90Anim2}
                                //onTap={() => handleAnimation(41)}                                
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffd000",display: "flex", justifyContent: "flex-start", cursor: "pointer",alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 90
                            </motion.div>
                            <motion.div
                                animate={r180Anim}
                                onTap={() => handleAnimation(83)}                                
                                ref={r180Ref}

                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ffba00",display: "flex", cursor: "pointer",justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                   <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 180
                            </motion.div>
                            <motion.div
                                animate={r180Anim2}
                                //onTap={() => handleAnimation(83)}                                

                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffba00",display: "flex", justifyContent: "flex-start", cursor: "pointer",alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                   <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 180
                            </motion.div>
                            <motion.div
                                animate={r270Anim}
                                ref={r270Ref}
                                onTap={() => handleAnimation(124)}    
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ffa500",display: "flex",cursor: "pointer", justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                     <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 270
                            </motion.div>
                            <motion.div
                                animate={r270Anim2}
                                //onTap={() => handleAnimation(124)}    
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ffa500",display: "flex", justifyContent: "flex-start",cursor: "pointer", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                     <GrRotateLeft style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Rotate 270
                            </motion.div>
                        </Card.Body>
                        
                    </Card>
                    <Card style={{borderRadius: 10, backgroundColor: "#A9A9A9", paddingLeft: 50, paddingRight: 50, marginTop:5, justifyContent: "center", alignItems: "center"}}>
                        <Card.Body style={{alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                            <div style= {{justifyContent: "center", display: "flex", fontSize: 20, paddingTop: 5, fontFamily: "Avenir-light",paddingBottom: 1}}>
                                Reflections: 
                            </div>
                            <motion.div
                                animate={HAnim}
                                ref={HRef}

                                onTap={() => handleAnimation(235)}   
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ff8500",display: "flex", cursor: "pointer",justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 ,fontFamily: "Avenir-light", paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Horizontal
                            </motion.div>
                            <motion.div
                                animate={HAnim2}
                                //onTap={() => handleAnimation(235)}   
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff8500",display: "flex", justifyContent: "flex-start", cursor: "pointer",alignItems: "center", width: 170, borderRadius: 5 ,fontFamily: "Avenir-light", paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Horizontal
                            </motion.div>
                            <motion.div
                                animate={VAnim}
                                ref={VRef}

                                onTap={() => handleAnimation(277)}   
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ff7000",display: "flex", cursor: "pointer",justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Vertical
                            </motion.div>
                            <motion.div
                                animate={VAnim2}
                                //onTap={() => handleAnimation(277)}   
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff7000",display: "flex", justifyContent: "flex-start", cursor: "pointer",alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>

                                Vertical
                            </motion.div>
                            <motion.div
                                animate={DAnim}
                                ref={DRef}

                                onTap={() => handleAnimation(318)}  
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ff5a00",display: "flex", cursor: "pointer",justifyContent: "flex-start", alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Diagonal 1
                            </motion.div>
                            <motion.div
                                animate={DAnim2}
                                //onTap={() => handleAnimation(318)}  
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff5a00",display: "flex", justifyContent: "flex-start", cursor: "pointer",alignItems: "center", width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                                Diagonal 1
                            </motion.div>
                            <motion.div
                                animate={DprimeAnim}
                                ref={DprimeRef}

                                onTap={() => handleAnimation(360)}
                                whileHover={{scale:1.1}}
                                style={{position: "absolute", backgroundColor: "#ff4500",display: "flex",cursor: "pointer", justifyContent: "flex-start", alignItems: "center",width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                               Diagonal 2
                            </motion.div>
                            <motion.div
                                animate={DprimeAnim2}
                                //onTap={() => handleAnimation(360)}
                                whileHover={{scale:1.1}}
                                style={{backgroundColor: "#ff4500",display: "flex", justifyContent: "flex-start",cursor: "pointer", alignItems: "center",width: 170, borderRadius: 5 , fontFamily: "Avenir-light",paddingTop: 5, paddingBottom: 5, marginBottom: 4,fontSize: 20, opacity:1}}
                            >
                                <CgEditFlipH style={{fontSize: 20, marginRight: 10, marginLeft: 20}}/>
                               Diagonal 2
                            </motion.div>
                        </Card.Body>
                        
                    </Card>
                    
                </Card>
            </div>
        )
    }


    return (
        <div className="Page" style={{display: "flex", flexDirection: "column"}} >
            <div style={{display: "flex", paddingLeft: 30, backgroundColor: "#DCDCDC",}}>
                <h1 style={{fontFamily: "Avenir-light", flex: 1}}>Visualize Group Theory</h1>
                <h1 style={{fontFamily: "Avenir-light",  marginTop: 35, marginRight: 90, fontSize: 13}}>created by Alex Young</h1>

            </div>
            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center",}}>
                <div style={{display: "flex", flexDirection: "row",  alignContent: "center"}}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: windowWidth*.02}}>
                        <div>
                            <h1 style={{fontSize: 20, display: "flex", justifycontent: "center", alignItems: "center", fontFamily: "Avenir-light",}}>Original</h1>
                        </div>
                        
                        {squares()}
                        <div>
                            <motion.h1 
                                animate={info}
                                whileHover={{scale:1.05}}
                                style={{borderRadius: 10, fontStyle: "italic", cursor: "pointer", backgroundColor: "#DCDCDC", alignItems: "center", paddingTop: 10, paddingLeft: 20, paddingRight: 20, paddingBottom: 10, fontSize: 16,fontFamily: "Avenir-light", marginTop: 20,  width: 200,  justifyContent: "center", display: "flex"}}>
                                    The Dihedral Group of Order 4 (D4) describes the rotations and reflections that capture the symmetries of a square. Each composition of two group elements is equivalent to some element in the group!
                            </motion.h1>
                        </div>
                        
                        
                    </div>
                    <div style={{marginLeft: windowWidth*.6}}>

                    </div>
                    <AnimatePresence>
                        {initialMessage && (
                            
                            <motion.h1 
                            initial={{opacity:1}}
                            exit={{opacity:0, transition: {duration: 1}}}
                                style={{position: "absolute", marginLeft: windowWidth*.28, marginTop: windowHeight*.28, width: 700, fontSize: 25,fontFamily: "Avenir-light", display: "flex",}}>
                                this tool visualizes the symmetry group of a square

                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {initialMessage && (
                            
                            <motion.h1 
                            initial={{opacity:1}}
                            exit={{opacity:0, transition: {duration: 1}}}
                                style={{position: "absolute", marginLeft: windowWidth*.26, marginTop: windowHeight*.35, width: 700, fontSize: 25,fontFamily: "Avenir-light", display: "flex",}}>
                                click on two D4 group elements to create a composition

                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginRight: windowWidth*.02}}>
                        <h1 style={{fontSize: 20,display: "flex", fontFamily: "Avenir-light"}}>D4 Group Elements</h1>
                        {elements()}
                    </div>
                    
                </div>
                
                

            </div>
    
            <div style= {{justifyContent: "center",  alignItems: "center", alignContent: "center", flexDirection: "column", display: "flex", marginTop: windowHeight*.005, marginLeft: -windowWidth*.03}}>   
                <div style={{display:"flex", marginLeft: -180}}>
                    <motion.div
                        onTap={() => resetAnimations()}
                        whileHover={{scale:1.1}}
                        animate={resetAnim}
                        style={{cursor: "pointer", fontSize: 30, color: "#ff9000", marginRight: windowWidth*.06, marginLeft: -windowWidth*.06,}}>
                        
                        reset
                    </motion.div>  
                    <div style={{fontFamily: "Avenir-light", fontSize: 30}}>
                        composition:  
                    </div>
                    <div 
                    ref={comp1Ref}
                    style={{backgroundColor: "#E8E8E8", marginLeft: windowWidth*.01, marginRight: windowWidth*.005, borderRadius: 10, width: 200, height: 45}}>

                    </div>
                    <div style={{fontFamily: "Avenir-light", fontSize: 20, display: "flex", alignItems: "center"}}>
                        + 
                    </div>
                    <div 
                    ref={comp2Ref}
                    style={{backgroundColor: "#E8E8E8", marginLeft: windowWidth*.005, marginRight: windowWidth*.005, borderRadius: 10, width: 200, height: 45}}>

                    </div>
                    <div style={{fontFamily: "Avenir-light", fontSize: 20, display: "flex", alignItems: "center"}}>
                        = 
                    </div>
                    <div 
                    ref={compResultRef}
                    style={{backgroundColor: "#E8E8E8", marginLeft: windowWidth*.005, marginRight: windowWidth*.01, borderRadius: 10, width: 200, height: 45}}>

                    </div>
                </div>
                <div style={{display:"flex", alignItems: "center",}}>
                
                <motion.div 
                    onTap={() => handleStart()}
                    initial={{opacity: .5}}
                    whileHover={{scale:1.2}}
                    animate={playAnim}
                    style={{paddingTop: 20, marginLeft: 55, fontSize: 60, color: "orange",  display: "flex", justifyContent: "center", alignItems: "center"}}>
                    
                    <AiFillPlayCircle />
                </motion.div>
                

          
            </div>
                
            </div>




           

           


            
        </div>
  );
}
