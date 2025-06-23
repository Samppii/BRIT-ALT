// src/components/VoiceBRIT.js
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Define CSS variables matching the design system
const theme = {
    black: '#000000',
    techDark: '#0a0a0a',
    techBlue: '#00d4ff',
    techBlueDark: '#0099cc',
    techOrange: '#ff6b35',
    techRed: '#ff3333',
    techGrid: '#1a1a1a',
    techBorder: '#333',
    techText: '#ffffff',
    techTextDim: '#999',
    panelBg: 'rgba(10, 10, 10, 0.95)',
    glowColor: '#00d4ff',
    warningColor: '#ff6b35',
    mainRed: '#ef4223',
    mainBlue: '#2baae2',
    mainYellow: '#f6eb16'
};

// Script dialogues integrated from backend
const SCRIPT_DIALOGUES = {
    // Day 1
    "hey brit": "Hello inventors, how can I help you?",
    "hello brit": "Hello inventors, how can I help you?",
    "hi brit": "Hello inventors, how can I help you?",
    "hey brett": "Hello inventors, how can I help you?",
    "hey britt": "Hello inventors, how can I help you?",
    "hey bread": "Hello inventors, how can I help you?",
    "hey bridge": "Hello inventors, how can I help you?",
    "hey breath": "Hello inventors, how can I help you?",
    "hey bret": "Hello inventors, how can I help you?",
    "hey b r i t": "Hello inventors, how can I help you?",
    "brit": "Hello inventors, how can I help you?",
    "brett": "Hello inventors, how can I help you?",
    "can you remind us what harvey needed us to find": "Harvey gave us explicit instructions to find the supplies he needs to build the \"Emotional Shrink Ray\". Before we begin, you will need to assemble your 3D glasses found in your inventors Lab book.",
    "can you find a verse in the bible that talks about working as a team": "Ecclesiastes 4:9 says 'Two people are better than one. They can help each other in everything they do.'",
    "we found all the pieces for harvey to put together the emotional shrink ray. can you pull up a blueprint of how it all goes together": "Philippian's 4:13 says, \"I can do all things through Christ because he gives me strength.\"",

    // Day 2
    "how do we find the esr in such a big space when we're so small": "It is going to be difficult to find the ESR, but Harvey has an invention that can help us. It is called a thermal lens. First, you need to assemble it. Assemble the magnifying glass and equip it with the thermal red lens.",
    "can you find a bible verse to encourage us to trust god": "Isaiah 41:10 says, \"So do not be afraid. I am with you. Do not be terrified. I am your God.\"",
    "our thermal lenses revealed that the esr is on the shelf. can you zoom in on the shelf to see if it is there": "I'd be happy to assist you in your search.",

    // Day 3
    "can you give us our instructions to help harvey": "I could give you your instructions, but I think that it would be wiser for you to watch this Bible story video first. The Bible should always be the first place you look.",
    "how does that bible story help us figure out what's wrong with the esr": "Great question. All of the followers must have been so confused when Paul completely changed his way of thinking and became a follower of Jesus. Everything probably seemed mixed-up and upside down when the guy who used to be against them was now teaching others about Jesus.\n\nTo figure out what's wrong with the ESR, you will need to unscramble some mixed-up words, so that Harvey can fix it and completely change everyone back to your regular size. Once you unscramble the mixed-up words, report back to me with the highlighted letters, so that we can figure out the bonus word.",
    "here are the highlighted letters. they are a, d, j, u, s, t, m, e, n, t. can you put those into your database to figure out what is wrong with the esr": "Yes, I am going to mix up the words and give you a couple possibilities of what the problem might be. Inventors, tell me what you think is the right answer.",
    "does the esr need an adjustment": "Yes, that's correct. Brilliant work inventors! We must let Harvey know immediately."
};

// Voice file mapping for specific dialogues - UPDATED TO MATCH YOUR ACTUAL FILES
const VOICE_FILES = {
    "hey brit": "hello_inventors.mp3",
    "hello brit": "hello_inventors.mp3",
    "hi brit": "hello_inventors.mp3",
    "can you remind us what harvey needed us to find": "harvey_instructions.mp3",
    "can you find a verse in the bible that talks about working as a team": "ecclesiastes_4_9.mp3",
    "we found all the pieces for harvey to put together the emotional shrink ray. can you pull up a blueprint of how it all goes together": "philippians_4_13.mp3",
    "how do we find the esr in such a big space when we're so small": "thermal_lens_instructions.mp3",
    "can you find a bible verse to encourage us to trust god": "isaiah_41_10.mp3",
    "our thermal lenses revealed that the esr is on the shelf. can you zoom in on the shelf to see if it is there": "assist_search.mp3",
    "can you give us our instructions to help harvey": "watch_bible_story.mp3",
    "how does that bible story help us figure out what's wrong with the esr": "word_scramble_instructions.mp3",
    "here are the highlighted letters. they are a, d, j, u, s, t, m, e, n, t. can you put those into your database to figure out what is wrong with the esr": "mix_up_words.mp3",
    "does the esr need an adjustment": "brilliant_work.mp3"
};

// Function to get script response
const getScriptResponse = (userInput) => {
    const normalizedInput = userInput.toLowerCase().trim().replace(/[?!]/g, "");

    // Direct match
    if (normalizedInput in SCRIPT_DIALOGUES) {
        return {
            response: SCRIPT_DIALOGUES[normalizedInput],
            voiceFile: VOICE_FILES[normalizedInput]
        };
    }

    // Special handling for highlighted letters dialogue with multiple variations
    if (normalizedInput.includes("highlighted letters") &&
        (normalizedInput.includes("a") && normalizedInput.includes("d") && normalizedInput.includes("j") &&
            normalizedInput.includes("u") && normalizedInput.includes("s") && normalizedInput.includes("t") &&
            normalizedInput.includes("m") && normalizedInput.includes("e") && normalizedInput.includes("n") &&
            normalizedInput.includes("t"))) {
        const key = "here are the highlighted letters. they are a, d, j, u, s, t, m, e, n, t. can you put those into your database to figure out what is wrong with the esr";
        return {
            response: SCRIPT_DIALOGUES[key],
            voiceFile: VOICE_FILES[key]
        };
    }

    if (normalizedInput.includes("blueprint") && normalizedInput.includes("emotional shrink")) {
        const key = "we found all the pieces for harvey to put together the emotional shrink ray. can you pull up a blueprint of how it all goes together";
        return {
            response: SCRIPT_DIALOGUES[key],
            voiceFile: VOICE_FILES[key]
        };
    }

    // Try to find the closest match for partial inputs
    for (const [key, response] of Object.entries(SCRIPT_DIALOGUES)) {
        const keywords = ["harvey", "esr", "emotional shrink", "blueprint", "bible verse", "thermal", "shelf", "highlighted", "adjustment"];

        if (keywords.some(keyword => normalizedInput.includes(keyword)) &&
            key.split(' ').some(word => word.length > 3 && normalizedInput.includes(word))) {
            return {
                response: response,
                voiceFile: VOICE_FILES[key]
            };
        }
    }

    return {
        response: "I'm not sure I understand. Can you try asking that a different way?",
        voiceFile: null
    };
};

// Animations
const gridMove = keyframes`
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
`;

const scanline = keyframes`
    0% { left: -100%; }
    100% { left: 100%; }
`;

const topGlow = keyframes`
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
`;

const rotate = keyframes`
    100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(180deg); }
`;

const blink = keyframes`
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
`;

const wave = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.5); }
`;

const messageSlide = keyframes`
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

const dataStream = keyframes`
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const typewriter = keyframes`
    from { width: 0; }
    to { width: 100%; }
`;

// Styled Components for 1920x1080 viewport with mobile responsiveness
const AppWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: ${theme.black};
    position: fixed;
    top: 0;
    left: 0;
`;

const AppContainer = styled.div`
    width: 1920px;
    height: 1080px;
    max-width: 100vw;
    max-height: 100vh;
    margin: 0 auto;
    background: ${theme.black};
    color: ${theme.techText};
    position: relative;
    overflow: hidden;
    font-family: 'Arial', monospace;
    display: flex;
    flex-direction: column;
    padding-bottom: 0;

    @media (max-width: 768px) {
        width: 100vw;
        height: 100vh;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image:
                linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: ${gridMove} 20s linear infinite;
        pointer-events: none;
        z-index: -1;

        @media (max-width: 768px) {
            background-size: 25px 25px;
        }
    }
`;

const TechHeader = styled.header`
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7));
    border-bottom: 2px solid ${theme.techOrange};
    padding: 2rem 0;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;

    @media (max-width: 768px) {
        padding: 1rem 0;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, ${theme.techOrange}, transparent);
        animation: ${scanline} 3s linear infinite;
    }
`;

const Title = styled.h1`
    text-align: center;
    font-size: 4rem;
    font-weight: bold;
    letter-spacing: 12px;
    text-transform: uppercase;
    background: linear-gradient(45deg, ${theme.techBlue}, ${theme.techOrange});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 2.5rem;
        letter-spacing: 6px;
    }

    @media (max-width: 480px) {
        font-size: 2rem;
        letter-spacing: 4px;
    }
`;

const MissionBrief = styled.div`
    text-align: center;
    color: ${theme.techOrange};
    font-size: 1.2rem;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-top: 0.8rem;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        letter-spacing: 3px;
        padding: 0 1rem;
    }

    @media (max-width: 480px) {
        font-size: 0.7rem;
        letter-spacing: 2px;
    }
`;

const MainContainer = styled.div`
    display: flex;
    gap: 2rem;
    padding: 2rem;
    padding-bottom: ${props => props.buttonsVisible ? '140px' : '2rem'};
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
    transition: padding-bottom 0.5s ease-in-out;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        padding-bottom: ${props => props.buttonsVisible ? '200px' : '1rem'};
    }
`;

const DialogueButtonsContainer = styled.div`
    position: fixed;
    bottom: ${props => props.hidden ? '-200px' : '0'};
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    border-top: 2px solid ${theme.techBorder};
    padding: 1.5rem;
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    z-index: 100;
    transition: bottom 0.5s ease-in-out;
    height: 120px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        height: 160px;
        padding: 1rem;
        gap: 0.8rem;
        bottom: ${props => props.hidden ? '-180px' : '0'};
    }

    @media (max-width: 480px) {
        height: 200px;
        gap: 0.5rem;
        padding: 0.8rem;
        bottom: ${props => props.hidden ? '-220px' : '0'};
    }
`;

const DialogueCloseButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    background: transparent;
    border: 1px solid ${theme.techBorder};
    color: ${theme.techTextDim};
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    border-radius: 50%;

    @media (max-width: 768px) {
        width: 35px;
        height: 35px;
        font-size: 1.4rem;
        top: 0.8rem;
        right: 0.8rem;
        border: 2px solid ${theme.techBorder};
    }

    @media (max-width: 480px) {
        width: 40px;
        height: 40px;
        font-size: 1.6rem;
        top: 0.5rem;
        right: 0.5rem;
        border: 2px solid ${theme.techOrange};
        color: ${theme.techOrange};
        background: rgba(255, 107, 53, 0.1);
    }

    &:hover {
        border-color: ${theme.techOrange};
        color: ${theme.techOrange};
        background: rgba(255, 107, 53, 0.1);
    }
`;

// Add hover area to trigger button display
const DialogueHoverArea = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    z-index: 99;
    pointer-events: ${props => props.hidden ? 'auto' : 'none'};
    background: transparent;
`;

// Add a small indicator to show hidden buttons
const DialogueButton = styled.button`
    background: ${theme.techGrid};
    border: 1px solid ${theme.techBlue};
    color: ${theme.techBlue};
    padding: 1.2rem 2rem;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 0.9rem;
    font-weight: bold;
    transition: all 0.3s ease;
    position: relative;

    @media (max-width: 768px) {
        padding: 1rem 1.5rem;
        font-size: 0.8rem;
        flex: 1;
        min-width: 120px;
    }

    @media (max-width: 480px) {
        padding: 0.8rem 1rem;
        font-size: 0.7rem;
        min-width: 100px;
    }

    &:hover {
        background: rgba(0, 212, 255, 0.1);
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
    }

    .shortcut {
        position: absolute;
        top: -10px;
        right: -10px;
        background: ${theme.techOrange};
        color: ${theme.black};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);

        @media (max-width: 768px) {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
            top: -8px;
            right: -8px;
        }

        @media (max-width: 480px) {
            display: none;
        }
    }
`;

const BritPanel = styled.div`
    flex: 0 0 450px;
    background: ${theme.panelBg};
    border: 1px solid ${theme.techBorder};
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        flex: 0 0 auto;
        height: 400px;
        order: 2;
    }

    @media (max-width: 480px) {
        height: 350px;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, ${theme.techBlue}, transparent);
        animation: ${topGlow} 2s ease-in-out infinite;
    }

    &.listening .status-led:nth-child(1) {
        background: ${theme.techOrange};
        box-shadow: 0 0 10px ${theme.techOrange};
        animation: ${blink} 1s ease-in-out infinite;
    }

    &.speaking .status-led {
        background: ${theme.techBlue};
        box-shadow: 0 0 10px ${theme.techBlue};
        animation: ${wave} 0.5s ease-in-out infinite;
    }

    &.speaking .status-led:nth-child(1) { animation-delay: 0s; }
    &.speaking .status-led:nth-child(2) { animation-delay: 0.1s; }
    &.speaking .status-led:nth-child(3) { animation-delay: 0.2s; }
    &.speaking .status-led:nth-child(4) { animation-delay: 0.3s; }
    &.speaking .status-led:nth-child(5) { animation-delay: 0.4s; }
`;

const BritHeader = styled.div`
    background: rgba(0, 212, 255, 0.1);
    padding: 1.2rem;
    border-bottom: 1px solid ${theme.techBorder};
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 4px;
    font-weight: bold;
    font-size: 1.1rem;
`;

const BritVideoContainer = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2rem;
`;

const BritVideoWrapper = styled.div`
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0, 212, 255, 0.5);

    @media (max-width: 768px) {
        width: 150px;
        height: 150px;
    }

    @media (max-width: 480px) {
        width: 120px;
        height: 120px;
    }

    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: conic-gradient(
                from 0deg,
                ${theme.techBlue},
                ${theme.techOrange},
                ${theme.techBlue}
        );
        border-radius: 50%;
        animation: ${rotate} 3s linear infinite;
        z-index: -1;
    }

    ${props => props.speaking && css`
        &::before {
            animation: ${rotate} 1s linear infinite, ${pulse} 0.5s ease-in-out infinite;
        }
    `}
`;

const BritVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
`;

const BritStatus = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    padding: 1.2rem;
    border-top: 1px solid ${theme.techBorder};
`;

const StatusLed = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${theme.techBorder};
    transition: all 0.3s ease;
`;

const DayButtonsContainer = styled.div`
    display: flex;
    gap: 0.8rem;
    padding: 1.2rem;
    border-top: 1px solid ${theme.techBorder};
`;

const DayButton = styled.button`
    flex: 1;
    background: ${props => props.active ? 'rgba(0, 212, 255, 0.2)' : theme.techGrid};
    border: 1px solid ${props => props.active ? theme.techBlue : theme.techBorder};
    color: ${props => props.active ? theme.techBlue : theme.techTextDim};
    padding: 0.8rem;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
        padding: 0.6rem;
        font-size: 0.8rem;
    }

    @media (max-width: 480px) {
        padding: 0.5rem;
        font-size: 0.7rem;
    }

    &:hover {
        border-color: ${theme.techBlue};
        color: ${theme.techBlue};
    }
`;

const ChatPanel = styled.div`
    flex: 1;
    background: ${theme.panelBg};
    border: 1px solid ${theme.techBorder};
    display: flex;
    flex-direction: column;
    position: relative;

    @media (max-width: 768px) {
        order: 1;
        min-height: 400px;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, ${theme.techOrange}, transparent);
        animation: ${topGlow} 2s ease-in-out infinite;
        animation-delay: 1s;
    }
`;

const DayIndicator = styled.div`
    background: rgba(255, 107, 53, 0.1);
    border-bottom: 1px solid ${theme.techBorder};
    padding: 1.2rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 4px;
    font-weight: bold;
    color: ${theme.techOrange};
    font-size: 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.9rem;
        letter-spacing: 2px;
        padding: 0.8rem;
    }

    @media (max-width: 480px) {
        font-size: 0.7rem;
        letter-spacing: 1px;
    }
`;

const VideoButton = styled.button`
    background: ${theme.techGrid};
    border: 1px solid ${theme.techOrange};
    color: ${theme.techOrange};
    padding: 0.8rem 1.5rem;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 107, 53, 0.1);
        box-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
    }
`;

const MessagesContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background: ${theme.techGrid};
    }

    &::-webkit-scrollbar-thumb {
        background: ${theme.techBorder};
        border-radius: 0;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: ${theme.techBlueDark};
    }
`;

const Message = styled.div`
    padding: 1.2rem 1.5rem;
    border: 1px solid ${theme.techBorder};
    position: relative;
    animation: ${messageSlide} 0.3s ease;
    font-family: monospace;
    font-size: 1rem;
    line-height: 1.6;
`;

const BritMessage = styled(Message)`
    background: rgba(0, 212, 255, 0.05);
    border-color: ${theme.techBlueDark};
    align-self: flex-start;
    max-width: 80%;
    border-left: 3px solid ${theme.techBlue};

    &::before {
        content: 'BRIT://';
        color: ${theme.techBlue};
        font-weight: bold;
        display: block;
        margin-bottom: 0.3rem;
    }
`;

const UserMessage = styled(Message)`
    background: rgba(255, 107, 53, 0.05);
    border-color: ${theme.techOrange};
    align-self: flex-end;
    max-width: 80%;
    border-right: 3px solid ${theme.techOrange};
    text-align: right;

    &::before {
        content: 'USER://';
        color: ${theme.techOrange};
        font-weight: bold;
        display: block;
        margin-bottom: 0.3rem;
    }
`;

const InputSection = styled.div`
    border-top: 1px solid ${theme.techBorder};
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.5);
`;

const InputContainer = styled.div`
    display: flex;
    gap: 1.2rem;
`;

const Input = styled.input`
    flex: 1;
    background: ${theme.techGrid};
    border: 1px solid ${theme.techBorder};
    color: ${theme.techText};
    padding: 1.2rem;
    font-family: monospace;
    font-size: 1rem;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
        padding: 1rem;
        font-size: 0.9rem;
    }

    @media (max-width: 480px) {
        padding: 0.8rem;
        font-size: 0.8rem;
    }

    &:focus {
        outline: none;
        border-color: ${theme.techBlue};
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
    }

    &::placeholder {
        color: ${theme.techTextDim};
    }
`;

const Button = styled.button`
    background: ${theme.techGrid};
    border: 1px solid ${theme.techBorder};
    color: ${theme.techText};
    padding: 1.2rem 2rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 1rem 1.5rem;
        font-size: 0.9rem;
        letter-spacing: 1px;
    }

    @media (max-width: 480px) {
        padding: 0.8rem 1rem;
        font-size: 0.8rem;
        letter-spacing: 1px;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.5s ease;
    }

    &:hover::before {
        left: 100%;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const SendButton = styled(Button)`
    border-color: ${theme.techBlue};
    color: ${theme.techBlue};

    &:hover:not(:disabled) {
        background: rgba(0, 212, 255, 0.1);
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    }
`;

const VoiceButton = styled(Button)`
    border-color: ${theme.techOrange};
    color: ${theme.techOrange};

    &:hover:not(:disabled) {
        background: rgba(255, 107, 53, 0.1);
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
    }

    ${props => props.listening && css`
        background: rgba(255, 107, 53, 0.2);
        animation: ${pulse} 1s ease-in-out infinite;
    `}
`;

const EffectsOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: ${props => props.active ? 'flex' : 'none'};
    align-items: flex-start;
    justify-content: center;
    padding-top: 100px;
    z-index: 1000;
    animation: ${props => props.active ? css`${dataStream} 0.3s ease` : 'none'};
`;

const CloseButton = styled.button`
    position: absolute;
    top: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: ${theme.techGrid};
    border: 1px solid ${theme.techBorder};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: ${theme.techOrange};
    transition: all 0.3s ease;

    &:hover {
        border-color: ${theme.techOrange};
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
    }
`;

const ActivityPanel = styled.div`
    position: fixed;
    right: ${props => props.active ? '0' : '-500px'};
    top: 120px;
    width: 450px;
    max-height: 75vh;
    background: ${theme.panelBg};
    border: 1px solid ${theme.techBorder};
    border-left: 3px solid ${theme.techOrange};
    padding: 2.5rem;
    transition: right 0.5s ease;
    z-index: 999;
    overflow-y: auto;
`;

const ActivityTitle = styled.div`
    color: ${theme.techOrange};
    text-transform: uppercase;
    letter-spacing: 4px;
    font-weight: bold;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid ${theme.techBorder};
    font-size: 1.4rem;
`;

const ActivityInstructions = styled.div`
    color: ${theme.techText};
    line-height: 2;
    margin-bottom: 2.5rem;

    p {
        margin-bottom: 1.5rem;
        padding-left: 1.5rem;
        border-left: 2px solid ${theme.techBlue};
        font-size: 1.1rem;
    }
`;

const BlueprintContainer = styled.div`
    width: 90%;
    max-width: 1200px;
    height: 800px;
    background: #001122;
    border: 2px solid ${theme.techBlue};
    padding: 2rem;
    position: relative;
    animation: ${dataStream} 0.5s ease;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image:
                linear-gradient(0deg, transparent 24%, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 212, 255, 0.05) 75%, rgba(0, 212, 255, 0.05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 212, 255, 0.05) 75%, rgba(0, 212, 255, 0.05) 76%, transparent 77%, transparent);
        background-size: 40px 40px;
        pointer-events: none;
    }
`;

const BlueprintTitle = styled.h2`
    color: ${theme.techBlue};
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 5px;
    margin-bottom: 1rem;
    font-size: 1.5rem;
`;

const BlueprintImage = styled.div`
    width: 100%;
    height: calc(100% - 3rem);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.techBlue};
    font-size: 1.5rem;
    text-align: center;
    border: 2px dashed ${theme.techBlue};
    background: rgba(0, 212, 255, 0.05);
`;

const ZoomContainer = styled.div`
    width: 90%;
    max-width: 1200px;
    height: 800px;
    background: ${theme.black};
    border: 2px solid ${theme.techBlue};
    overflow: hidden;
    position: relative;
    animation: ${dataStream} 0.5s ease;
`;

const ZoomImage = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.techBlue};
    font-size: 1.5rem;
    text-align: center;
    background: rgba(0, 212, 255, 0.05);
`;

const WordOptionsContainer = styled.div`
    background: ${theme.panelBg};
    border: 2px solid ${theme.techOrange};
    padding: 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
    width: 90%;
    animation: ${dataStream} 0.5s ease;
`;

const WordOptionsTitle = styled.h2`
    text-align: center;
    color: ${theme.techOrange};
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 2rem;
`;

const WordOption = styled.button`
    background: ${theme.techGrid};
    border: 1px solid ${theme.techBorder};
    color: ${theme.techText};
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: bold;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    font-size: 1.1rem;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);
        transition: left 0.5s ease;
    }

    &:hover {
        border-color: ${theme.techBlue};
        color: ${theme.techBlue};
        transform: translateX(10px);
    }

    &:hover::before {
        left: 100%;
    }

    &.wrong {
        border-color: ${theme.techRed};
        background: rgba(255, 51, 51, 0.1);
        animation: shake 0.5s ease;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

const ProcessingAnimation = styled.div`
    color: ${theme.techBlue};
    font-size: 2rem;
    font-family: monospace;
    text-align: center;
    animation: ${dataStream} 0.5s ease;
`;

const ProcessingBar = styled.div`
    margin-top: 20px;
    font-size: 1rem;

    .processing-fill {
        display: inline-block;
        overflow: hidden;
        animation: ${typewriter} 2s ease-out forwards;
    }
`;

// Add a small indicator to show hidden buttons
const DialogueIndicator = styled.div`
    position: fixed;
    bottom: ${props => props.shouldShow ? '10px' : '-60px'};
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.techGrid};
    border: 1px solid ${theme.techBlue};
    color: ${theme.techBlue};
    padding: 0.8rem 1.5rem;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: all 0.4s ease;
    z-index: 99;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
    width: auto;
    max-width: 250px;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
        transition: left 0.5s ease;
    }
    
    &:hover {
        background: rgba(0, 212, 255, 0.1);
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        transform: translateX(-50%) translateY(-2px);
    }

    &:hover::before {
        left: 100%;
    }

    .arrow {
        font-size: 1rem;
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }

    &:hover .arrow {
        transform: translateY(-2px);
    }
`;

// Bible Videos Data
const BIBLE_VIDEOS = {
    1: { url: "/videos/day1_bible_story.mp4", duration: "1:38", title: "Day 1 - Paul's Conversion" },
    2: { url: "/videos/day2_bible_story.mp4", duration: "2:34", title: "Day 2 - Paul and Silas in Prison" },
    3: { url: "/videos/day3_bible_story.mp4", duration: "1:51", title: "Day 3 - Paul's Transformation" }
};

// Dialogue Buttons Data
const DialogueButtons = {
    1: [
        { text: "Hey BRIT", dialogue: "Hey BRIT" },
        { text: "What did Harvey need?", dialogue: "Can you remind us what Harvey needed us to find?" },
        { text: "Team verse", dialogue: "Can you find a verse in the bible that talks about working as a team?" },
        { text: "Blueprint", dialogue: "We found all the pieces for Harvey to put together the emotional shrink ray. Can you pull up a blueprint of how it all goes together?" }
    ],
    2: [
        { text: "Hey BRIT", dialogue: "Hey BRIT" },
        { text: "Find ESR", dialogue: "How do we find the ESR in such a big space when we're so small?" },
        { text: "Trust verse", dialogue: "Can you find a bible verse to encourage us to trust God?" },
        { text: "Zoom shelf", dialogue: "Our thermal lenses revealed that the ESR is on the shelf. Can you zoom in on the shelf to see if it is there?" }
    ],
    3: [
        { text: "Hey BRIT", dialogue: "Hey BRIT" },
        { text: "Instructions", dialogue: "Can you give us our instructions to help Harvey?" },
        { text: "Bible story help", dialogue: "How does that Bible story help us figure out what's wrong with the ESR?" },
        { text: "Letters", dialogue: "Here are the highlighted letters. They are a, d, j, u, s, t, m, e, n, t. Can you put those into your database to figure out what is wrong with the ESR?" },
        { text: "Adjustment?", dialogue: "Does the ESR need an adjustment?" }
    ]
};

// Activity data
const ACTIVITY_DATA = {
    1: {
        1: {
            title: "3D GLASSES ASSEMBLY",
            instructions: [
                "Locate your 3D glasses components in your inventor's lab book",
                "Carefully remove the red and blue lenses from the packaging",
                "Insert the red lens into the left frame slot",
                "Insert the blue lens into the right frame slot",
                "Ensure both lenses are securely fitted",
                "Put on your 3D glasses to test the fit",
                "You're now ready to see the world through inventor's eyes!"
            ]
        }
    },
    2: {
        1: {
            title: "THERMAL LENS ASSEMBLY",
            instructions: [
                "Find the magnifying glass in your inventor's kit",
                "Locate the red thermal lens component",
                "Carefully attach the red thermal lens to the magnifying glass",
                "Hold the thermal lens up and look through it",
                "The red lens will help detect heat signatures",
                "Use this to scan the environment for the ESR",
                "Look for warm objects that might be the ESR device"
            ]
        }
    },
    3: {
        1: {
            title: "WORD SCRAMBLE CHALLENGE",
            instructions: [
                "You need to unscramble mixed-up words related to the Bible story",
                "Each word has a highlighted letter that you need to collect",
                "Write down each highlighted letter as you solve the words",
                "Once you have all the highlighted letters, bring them back to BRIT",
                "BRIT will help you figure out what's wrong with the ESR",
                "The scrambled words are related to Paul's story and your adventure",
                "Take your time and think carefully about each word"
            ]
        }
    }
};

// Main Component
const VoiceBRIT = () => {
    const [messages, setMessages] = useState([
        { type: 'brit', text: "Hello inventors, welcome to the Research and Development Center! I'm BRIT, your Bible Reciting Intelligence Technology. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayContent, setDisplayContent] = useState(null);
    const [listening, setListening] = useState(false);
    const [currentDay, setCurrentDay] = useState(1);
    const [britState, setBritState] = useState('idle');
    const [showActivity, setShowActivity] = useState(false);
    const [activityData, setActivityData] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);
    const [buttonsHidden, setButtonsHidden] = useState(false);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const hideButtonsTimeoutRef = useRef(null);

    // Debug function to test voice file availability
    const testVoiceFiles = async () => {
        console.log('🧪 Testing all voice files...');
        const testFiles = [
            'hey_brit.mp3',
            'mix_up_words.mp3',
            'harvey_instructions.mp3'
        ];

        for (const file of testFiles) {
            try {
                const response = await fetch(`/voices/${file}`);
                console.log(`✅ ${file}: ${response.status} ${response.statusText}`);
            } catch (error) {
                console.log(`❌ ${file}: ${error.message}`);
            }
        }
    };

    // Call this on component mount for debugging
    useEffect(() => {
        // Start with buttons hidden on all days
        setButtonsHidden(true);

        return () => {
            if (hideButtonsTimeoutRef.current) {
                clearTimeout(hideButtonsTimeoutRef.current);
            }
        };
    }, []);

    // Speech recognition setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setListening(true);
                setBritState('listening');
                playBeep();
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSubmit(null, transcript);
            };

            recognitionRef.current.onend = () => {
                setListening(false);
                setBritState('idle');
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setListening(false);
                setBritState('idle');
            };
        }
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Don't trigger if user is typing in input field
            if (e.target.tagName === 'INPUT') return;

            const keyMap = {
                '1': 0, // Hey BRIT
                '2': 1, // Second dialogue
                '3': 2, // Third dialogue
                '4': 3, // Fourth dialogue
                '5': 4, // Fifth dialogue (if exists)
                'v': 'video',
                'V': 'video'
            };

            if (keyMap[e.key] !== undefined) {
                if (e.key === 'v' || e.key === 'V') {
                    openDayVideo();
                } else {
                    const buttonIndex = keyMap[e.key];
                    const currentButtons = DialogueButtons[currentDay];
                    if (currentButtons && currentButtons[buttonIndex]) {
                        handleDialogueButton(currentButtons[buttonIndex].dialogue);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentDay]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Show buttons when user interacts (no auto-hide)
    const showButtons = () => {
        setButtonsHidden(false);

        // Clear any existing timeout
        if (hideButtonsTimeoutRef.current) {
            clearTimeout(hideButtonsTimeoutRef.current);
        }
    };

    const playBeep = () => {
        // Create a beep sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio context not available');
        }
    };

    const showConfetti = () => {
        const colors = ['#ff6b35', '#00d4ff', '#f6eb16', '#2baae2', '#ef4223'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;

        // Create confetti pieces
        for (let i = 0; i < 100; i++) {
            const piece = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const size = Math.random() * 10 + 5;

            piece.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                top: -10px;
                transform: rotate(${Math.random() * 360}deg);
                animation: confettiFall 3s ease-in forwards;
                animation-delay: ${delay}s;
            `;

            confettiContainer.appendChild(piece);
        }

        document.body.appendChild(confettiContainer);

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Remove confetti after animation
        setTimeout(() => {
            if (document.body.contains(confettiContainer)) {
                document.body.removeChild(confettiContainer);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 4000);
    };

    const toggleListening = () => {
        if (listening) {
            recognitionRef.current?.stop();
        } else {
            try {
                recognitionRef.current?.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    };

    const handleSubmit = async (e, voiceInput = null) => {
        if (e) e.preventDefault();

        const userMessage = voiceInput || input.trim();
        if (!userMessage || isLoading) return;

        // Debug logging to see what's being processed
        console.log('🔍 Input received:', userMessage);
        console.log('🔍 Normalized input:', userMessage.toLowerCase().trim().replace(/[?!]/g, ""));

        // Check if this is the Day 3 highlighted letters dialogue
        if (currentDay === 3 && userMessage.toLowerCase().includes('highlighted letters') &&
            userMessage.toLowerCase().includes('a') && userMessage.toLowerCase().includes('d') &&
            userMessage.toLowerCase().includes('j') && userMessage.toLowerCase().includes('u') &&
            userMessage.toLowerCase().includes('s') && userMessage.toLowerCase().includes('t') &&
            userMessage.toLowerCase().includes('m') && userMessage.toLowerCase().includes('e') &&
            userMessage.toLowerCase().includes('n') && userMessage.toLowerCase().includes('t')) {

            // Add user message
            setMessages([...messages, { type: 'user', text: userMessage }]);

            // Add BRIT's response
            const britResponse = "Yes, I am going to mix up the words and give you a couple possibilities of what the problem might be. Inventors, tell me what you think is the right answer.";
            setMessages(prev => [...prev, { type: 'brit', text: britResponse }]);

            // Play the specific voice file for this dialogue
            console.log('🎵 Playing voice file for highlighted letters: mix_up_words.mp3');
            playVoiceFile('mix_up_words.mp3');

            // Show processing animation first
            setShowProcessing(true);
            setDisplayContent(
                <ProcessingAnimation>
                    <div>PROCESSING...</div>
                    <ProcessingBar>
                        <span>[</span>
                        <span className="processing-fill">====================</span>
                        <span>]</span>
                    </ProcessingBar>
                </ProcessingAnimation>
            );
            setShowOverlay(true);

            // After processing, show word options
            setTimeout(() => {
                setShowProcessing(false);
                setDisplayContent(
                    <WordOptionsContainer>
                        <WordOptionsTitle>SYSTEM ANALYSIS: SELECT REQUIRED COMPONENT</WordOptionsTitle>
                        {["Jam test", "Jaden", "Adjustment"].map((option, index) => (
                            <WordOption
                                key={index}
                                onClick={(e) => {
                                    if (option === 'Adjustment') {
                                        // Correct answer - show confetti
                                        showConfetti();
                                        setTimeout(() => {
                                            setInput('Does the ESR need an adjustment?');
                                            handleSubmit(null, 'Does the ESR need an adjustment?');
                                            setShowOverlay(false);
                                        }, 2000);
                                    } else {
                                        e.target.classList.add('wrong');
                                        setTimeout(() => {
                                            e.target.classList.remove('wrong');
                                        }, 1000);
                                    }
                                }}
                            >
                                {option.toUpperCase()}
                            </WordOption>
                        ))}
                    </WordOptionsContainer>
                );
            }, 2500);

            setInput('');
            return; // Don't process further
        }

        setInput('');
        setMessages([...messages, { type: 'user', text: userMessage }]);
        setIsLoading(true);

        // Get script response (now returns object with response and voiceFile)
        const responseData = getScriptResponse(userMessage);

        // Debug logging
        console.log('🔍 Response data:', responseData);
        console.log('🔍 Voice file:', responseData.voiceFile);

        // Add BRIT's response
        setMessages(prev => [...prev, { type: 'brit', text: responseData.response }]);

        // Play voice file if available, otherwise use text-to-speech
        if (responseData.voiceFile) {
            console.log('🎵 Playing voice file:', responseData.voiceFile);
            playVoiceFile(responseData.voiceFile);
        } else {
            console.log('🔄 No voice file, using text-to-speech');
            speakResponse(responseData.response);
        }

        // Handle special actions
        handleActions(userMessage);

        setIsLoading(false);
    };

    const playVoiceFile = (filename) => {
        console.log('🎵 Attempting to play voice file:', filename);
        console.log('🎵 Full URL:', `/voices/${filename}`);

        const audio = new Audio(`/voices/${filename}`);
        setBritState('speaking');

        audio.onloadstart = () => console.log('🎵 Audio loading started');
        audio.oncanplay = () => console.log('🎵 Audio can play');
        audio.onplay = () => console.log('🎵 Audio started playing');
        audio.onended = () => {
            console.log('🎵 Audio finished playing');
            setBritState('idle');
        };
        audio.onerror = (e) => {
            console.error('❌ Error playing voice file:', e);
            console.error('❌ Audio error details:', audio.error);
            console.log('🔄 Falling back to text-to-speech');
            // Fallback to text-to-speech
            speakResponse(messages[messages.length - 1]?.text || 'Audio not available');
        };

        audio.play().catch(e => {
            console.error('❌ Audio play failed:', e);
            console.log('🔄 Falling back to text-to-speech');
            // Fallback to text-to-speech
            speakResponse(messages[messages.length - 1]?.text || 'Audio not available');
        });
    };

    const speakResponse = (text) => {
        if (!('speechSynthesis' in window)) return;

        setBritState('speaking');
        const utterance = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('girl') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria')
        );

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.pitch = 1.2;
        utterance.rate = 0.9;

        utterance.onend = () => setBritState('idle');

        window.speechSynthesis.speak(utterance);
    };

    const handleActions = (userInput) => {
        const normalizedInput = userInput.toLowerCase();

        if (normalizedInput.includes("blueprint") && normalizedInput.includes("emotional shrink")) {
            setDisplayContent(
                <BlueprintContainer>
                    <BlueprintTitle>EMOTIONAL SHRINK RAY BLUEPRINT</BlueprintTitle>
                    <BlueprintImage>
                        <img
                            src="/images/esr_blueprint.png"
                            alt="ESR Blueprint Schematic"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `
                                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #00d4ff; font-size: 1.5rem; text-align: center;">
                                        [ESR Blueprint Schematic]<br/>
                                        Image: esr_blueprint.png not found<br/>
                                        Add to public/images/ folder
                                    </div>
                                `;
                            }}
                        />
                    </BlueprintImage>
                </BlueprintContainer>
            );
            setShowOverlay(true);
        } else if (normalizedInput.includes("zoom") && normalizedInput.includes("shelf")) {
            setDisplayContent(
                <ZoomContainer>
                    <ZoomImage>
                        <img
                            src="/images/shelf_with_pizza_guy.png"
                            alt="Zoomed view of shelf with ESR and Guy the Pizza Guy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `
                                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #00d4ff; font-size: 1.5rem; text-align: center;">
                                        [Zoomed view of shelf with ESR and Guy the Pizza Guy]<br/>
                                        Image: shelf_with_pizza_guy.png not found<br/>
                                        Add to public/images/ folder
                                    </div>
                                `;
                            }}
                        />
                    </ZoomImage>
                </ZoomContainer>
            );
            setShowOverlay(true);
        } else if (normalizedInput.includes("harvey") && normalizedInput.includes("needed")) {
            showActivityInstructions(1, 1);
        } else if (normalizedInput.includes("thermal") || (normalizedInput.includes("find") && normalizedInput.includes("esr"))) {
            showActivityInstructions(2, 1);
        } else if (normalizedInput.includes("bible story help") || normalizedInput.includes("wrong with the esr")) {
            showActivityInstructions(3, 1);
        }
    };

    const showActivityInstructions = (day, activity) => {
        const data = ACTIVITY_DATA[day]?.[activity];
        if (data) {
            setActivityData(data);
            setShowActivity(true);
        }
    };

    const changeDay = (day) => {
        setCurrentDay(day);
        setMessages([{
            type: 'brit',
            text: `System updated to Day ${day}. How can I assist you with today's activities?`
        }]);
        // Hide buttons when switching days
        setButtonsHidden(true);
    };

    const openDayVideo = () => {
        const video = BIBLE_VIDEOS[currentDay];
        if (video) {
            // Create a video element
            const videoElement = document.createElement('video');
            videoElement.src = video.url;
            videoElement.controls = true;
            videoElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: black;
                z-index: 9999;
                object-fit: contain;
            `;

            // Add error handling for missing video files
            videoElement.onerror = () => {
                alert(`Video: ${video.title} (${video.duration})\n\nVideo file not found. Please add ${video.url} to your public folder.\n\nFor now, this would play the Bible story video for Day ${currentDay}.`);
                document.body.removeChild(videoElement);
                if (document.body.contains(closeButton)) {
                    document.body.removeChild(closeButton);
                }
                if (document.body.contains(keyboardHint)) {
                    document.body.removeChild(keyboardHint);
                }
            };

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: rgba(0, 0, 0, 0.7);
                border: 2px solid white;
                color: white;
                font-size: 30px;
                cursor: pointer;
                z-index: 10000;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Add keyboard hint
            const keyboardHint = document.createElement('div');
            keyboardHint.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-family: monospace;
                z-index: 10000;
            `;
            keyboardHint.innerHTML = 'Press ESC or C to close';

            // Close function
            const closeVideo = () => {
                if (document.body.contains(videoElement)) {
                    document.body.removeChild(videoElement);
                }
                if (document.body.contains(closeButton)) {
                    document.body.removeChild(closeButton);
                }
                if (document.body.contains(keyboardHint)) {
                    document.body.removeChild(keyboardHint);
                }
                window.removeEventListener('keydown', handleKeyClose);
            };

            // Close on ESC or C key
            const handleKeyClose = (e) => {
                if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
                    closeVideo();
                }
            };

            // Event listeners
            videoElement.addEventListener('ended', closeVideo);
            closeButton.onclick = closeVideo;
            window.addEventListener('keydown', handleKeyClose);

            // Append to body
            document.body.appendChild(videoElement);
            document.body.appendChild(closeButton);
            document.body.appendChild(keyboardHint);

            // Try to go fullscreen automatically
            setTimeout(() => {
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen().catch(() => {
                        // If auto-fullscreen fails, video still plays full window
                    });
                } else if (videoElement.webkitRequestFullscreen) {
                    videoElement.webkitRequestFullscreen();
                } else if (videoElement.mozRequestFullScreen) {
                    videoElement.mozRequestFullScreen();
                }
                // Video will not auto-play - user must click play button
            }, 100);
        }
    };

    const handleDialogueButton = (dialogue) => {
        setInput(dialogue);
        handleSubmit(null, dialogue);

        // Keep buttons visible after clicking (no auto-hide)
    };

    return (
        <AppWrapper>
            <AppContainer>
                <TechHeader>
                    <Title>BRIT</Title>
                    <MissionBrief>MISSION BRIEF: BIBLE RECITING INTELLIGENCE TECHNOLOGY</MissionBrief>
                </TechHeader>

                <MainContainer buttonsVisible={!buttonsHidden}>
                    <BritPanel className={britState}>
                        <BritHeader>BRIT STATUS</BritHeader>
                        <BritVideoContainer>
                            <BritVideoWrapper speaking={britState === 'speaking'}>
                                <BritVideo autoPlay loop muted playsInline>
                                    {/* Placeholder for BRIT video */}
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(45deg, #00d4ff, #ff6b35)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '2rem',
                                        fontWeight: 'bold'
                                    }}>
                                        BRIT
                                    </div>
                                </BritVideo>
                            </BritVideoWrapper>
                        </BritVideoContainer>
                        <BritStatus>
                            <StatusLed className="status-led" />
                            <StatusLed className="status-led" />
                            <StatusLed className="status-led" />
                            <StatusLed className="status-led" />
                            <StatusLed className="status-led" />
                        </BritStatus>
                        <DayButtonsContainer>
                            <DayButton active={currentDay === 1} onClick={() => changeDay(1)}>
                                DAY 1
                            </DayButton>
                            <DayButton active={currentDay === 2} onClick={() => changeDay(2)}>
                                DAY 2
                            </DayButton>
                            <DayButton active={currentDay === 3} onClick={() => changeDay(3)}>
                                DAY 3
                            </DayButton>
                        </DayButtonsContainer>
                    </BritPanel>

                    <ChatPanel>
                        <DayIndicator>
                            <span>DAY {currentDay} // RESEARCH AND DEVELOPMENT CENTER</span>
                            <VideoButton onClick={openDayVideo}>
                                WATCH VIDEO ({BIBLE_VIDEOS[currentDay]?.duration})
                            </VideoButton>
                        </DayIndicator>
                        <MessagesContainer>
                            {messages.map((message, index) => (
                                message.type === 'user' ? (
                                    <UserMessage key={index}>
                                        {message.text}
                                    </UserMessage>
                                ) : (
                                    <BritMessage key={index}>
                                        {message.text}
                                    </BritMessage>
                                )
                            ))}
                            {isLoading && (
                                <BritMessage>
                                    PROCESSING...
                                </BritMessage>
                            )}
                            <div ref={messagesEndRef} />
                        </MessagesContainer>
                        <InputSection>
                            <InputContainer>
                                <Input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="ENTER COMMAND..."
                                    disabled={isLoading || listening}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleSubmit(e);
                                    }}
                                />
                                <SendButton
                                    onClick={handleSubmit}
                                    disabled={isLoading || !input.trim() || listening}
                                >
                                    SEND
                                </SendButton>
                                <VoiceButton
                                    listening={listening}
                                    onClick={toggleListening}
                                    disabled={isLoading}
                                >
                                    {listening ? 'LISTENING' : 'VOICE'}
                                </VoiceButton>
                            </InputContainer>
                        </InputSection>
                    </ChatPanel>
                </MainContainer>

                <EffectsOverlay active={showOverlay}>
                    <CloseButton onClick={() => {
                        setShowOverlay(false);
                        setShowProcessing(false);
                    }}>×</CloseButton>
                    {displayContent}
                </EffectsOverlay>

                <ActivityPanel active={showActivity}>
                    {activityData && (
                        <>
                            <ActivityTitle>{activityData.title}</ActivityTitle>
                            <ActivityInstructions>
                                {activityData.instructions?.map((instruction, index) => (
                                    <p key={index}>{instruction}</p>
                                ))}
                            </ActivityInstructions>
                            <CloseButton onClick={() => setShowActivity(false)} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                ×
                            </CloseButton>
                        </>
                    )}
                </ActivityPanel>

                <DialogueHoverArea
                    hidden={buttonsHidden}
                    onMouseEnter={() => {
                        if (buttonsHidden) {
                            showButtons();
                        }
                    }}
                />

                <DialogueButtonsContainer
                    hidden={buttonsHidden}
                >
                    <DialogueCloseButton
                        onClick={() => setButtonsHidden(true)}
                        title="Hide Quick Commands"
                    >
                        ×
                    </DialogueCloseButton>

                    {DialogueButtons[currentDay]?.map((button, index) => (
                        <DialogueButton
                            key={index}
                            onClick={() => handleDialogueButton(button.dialogue)}
                        >
                            {button.text}
                            <span className="shortcut">{index + 1}</span>
                        </DialogueButton>
                    ))}
                    <DialogueButton
                        onClick={() => openDayVideo()}
                        style={{ borderColor: theme.techOrange, color: theme.techOrange }}
                    >
                        WATCH VIDEO
                        <span className="shortcut">V</span>
                    </DialogueButton>
                </DialogueButtonsContainer>

                <DialogueIndicator
                    shouldShow={buttonsHidden}
                    onClick={() => showButtons()}
                >
                    <span className="arrow">↑</span>
                    Quick Commands
                </DialogueIndicator>
            </AppContainer>
        </AppWrapper>
    );
};

export default VoiceBRIT;