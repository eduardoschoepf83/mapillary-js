/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import {
    EdgeCalculator,
    EdgeCalculatorSettings,
    EdgeCalculatorDirections,
    EdgeConstants,
    IEdge,
    IPotentialEdge
} from "../../../src/Edge";
import {Spatial} from "../../../src/Geo";
import {EdgeCalculatorHelper} from "../../helper/EdgeCalculatorHelper.spec";

describe("EdgeCalculator.computeTurnEdges", () => {
    let edgeCalculator: EdgeCalculator;
    let edgeCalculatorSettings: EdgeCalculatorSettings;
    let edgeCalculatorDirections: EdgeCalculatorDirections;

    let edgeCalculatorHelper: EdgeCalculatorHelper;

    let spatial: Spatial;

    let potentialEdge: IPotentialEdge;

    beforeEach(() => {
        edgeCalculatorSettings = new EdgeCalculatorSettings();
        edgeCalculatorDirections = new EdgeCalculatorDirections();
        edgeCalculator = new EdgeCalculator(edgeCalculatorSettings, edgeCalculatorDirections);

        edgeCalculatorHelper = new EdgeCalculatorHelper();

        spatial = new Spatial();
    });

    beforeEach(() => {
       potentialEdge = edgeCalculatorHelper.createPotentialEdge();
       potentialEdge.distance = edgeCalculatorSettings.turnMaxDistance / 2;
    });

    it("should have a turn left edge", () => {
        potentialEdge.directionChange = Math.PI / 2;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_LEFT);
    });

    it("should have a turn right edge", () => {
        potentialEdge.directionChange = -Math.PI / 2;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_RIGHT);
    });

    it("should have a u-turn edge", () => {
        potentialEdge.directionChange = Math.PI;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_U);
    });
});

describe("EdgeCalculator.computeTurnEdges", () => {
    let edgeCalculator: EdgeCalculator;
    let edgeCalculatorSettings: EdgeCalculatorSettings;
    let edgeCalculatorDirections: EdgeCalculatorDirections;

    let edgeCalculatorHelper: EdgeCalculatorHelper;

    let spatial: Spatial;

    let potentialEdge1: IPotentialEdge;
    let potentialEdge2: IPotentialEdge;

    beforeEach(() => {
        edgeCalculatorSettings = new EdgeCalculatorSettings();
        edgeCalculatorDirections = new EdgeCalculatorDirections();
        edgeCalculator = new EdgeCalculator(edgeCalculatorSettings, edgeCalculatorDirections);

        edgeCalculatorHelper = new EdgeCalculatorHelper();

        spatial = new Spatial();
    });

    beforeEach(() => {
       potentialEdge1 = edgeCalculatorHelper.createPotentialEdge("pkey1");
       potentialEdge1.distance = edgeCalculatorSettings.turnMaxRigDistance * 2;

       potentialEdge2 = edgeCalculatorHelper.createPotentialEdge("pkey2");
       potentialEdge2.distance = edgeCalculatorSettings.turnMaxRigDistance * 2;
    });

    it("should have a turn left with the same sequence", () => {
        potentialEdge1.directionChange = Math.PI / 2;
        potentialEdge1.sameSequence = false;

        potentialEdge2.directionChange = Math.PI / 2;
        potentialEdge2.sameSequence = true;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge1, potentialEdge2]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_LEFT);
    });

    it("should have a turn left with the same merge cc", () => {
        potentialEdge1.directionChange = Math.PI / 2;
        potentialEdge1.sameMergeCc = false;

        potentialEdge2.directionChange = Math.PI / 2;
        potentialEdge2.sameMergeCc = true;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge1, potentialEdge2]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_LEFT);
    });

    it("should have a turn left edge with the smallest distance", () => {
        potentialEdge1.directionChange = Math.PI / 2;
        potentialEdge1.distance = 5;

        potentialEdge2.directionChange = Math.PI / 2;
        potentialEdge2.distance = 3;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge1, potentialEdge2]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_LEFT);
    });

    it("should have a turn left edge with the smallest motion difference", () => {
        let motionChange: number =
            edgeCalculatorDirections.turns[EdgeConstants.Direction.TURN_LEFT].motionChange;

        potentialEdge1.directionChange = Math.PI / 2;
        potentialEdge1.motionChange = 0.9 * motionChange;

        potentialEdge2.directionChange = Math.PI / 2;
        potentialEdge2.motionChange = motionChange;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge1, potentialEdge2]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_LEFT);
    });

    it("should have a turn left edge for rig setup with smallest direction change", () => {
        potentialEdge1.distance = 0.5 * edgeCalculatorSettings.turnMaxRigDistance;
        potentialEdge1.directionChange = 1.2 * edgeCalculatorSettings.turnMinRigDirectionChange;

        potentialEdge2.distance = 0.5 * edgeCalculatorSettings.turnMaxRigDistance;
        potentialEdge2.directionChange = 1.1 * edgeCalculatorSettings.turnMinRigDirectionChange;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge1, potentialEdge2]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_LEFT);
    });

    it("should have a turn right edge for rig setup with smallest direction change", () => {
        potentialEdge1.distance = 0.5 * edgeCalculatorSettings.turnMaxRigDistance;
        potentialEdge1.directionChange = -1.2 * edgeCalculatorSettings.turnMinRigDirectionChange;

        potentialEdge2.distance = 0.5 * edgeCalculatorSettings.turnMaxRigDistance;
        potentialEdge2.directionChange = -1.1 * edgeCalculatorSettings.turnMinRigDirectionChange;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge1, potentialEdge2]);

        expect(turnEdges.length).toBe(1);

        let turnEdge: IEdge = turnEdges[0];

        expect(turnEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(turnEdge.direction).toBe(EdgeConstants.Direction.TURN_RIGHT);
    });

    it("should not have a turn left edge for rig with too small angle", () => {
        potentialEdge1.distance = 0.5 * edgeCalculatorSettings.turnMaxRigDistance;
        potentialEdge1.directionChange = 0.9 * edgeCalculatorSettings.turnMinRigDirectionChange;

        potentialEdge1.distance = 0.5 * edgeCalculatorSettings.turnMaxRigDistance;
        potentialEdge1.directionChange = -0.9 * edgeCalculatorSettings.turnMinRigDirectionChange;

        let turnEdges: IEdge[] = edgeCalculator.computeTurnEdges([potentialEdge1, potentialEdge2]);

        expect(turnEdges.length).toBe(0);
    });
});