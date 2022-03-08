/**
 * 
 * https://editor.swagger.io/
 * 
 * @swagger
 * info:
 *   version: "1.0.0"
 *   title: "Car-Controller-backend"
 *   description: "This is a Car-Controller-backend server: Microwave Controller API to manage Microwave devices"
 * tags:
 *   - name: "Microwave Device"
 *     description: "Microwave Devices creation and enumeration"
 *   - name: "Microwave Public Link"
 *     description: "Microwave device acces public links generation"
 *   - name: "Microwave Session Control"
 *     description: "Microwave device session control commands "
 * schemes: ["https", "http"]
 * paths:
 *   /microwave/:
 *     get:
 *         tags: ["Microwave Device"]
 *         summary: "Get all Microwave devices"
 *         consumes:
 *          - "application/json"
 *         produces:
 *          - "application/json"
 *         responses:
 *             "200":
 *                 description: "The list of all Microwave devices"
 *             "500":
 *                 description: "Internal Server Error"
 *     post:
 *         tags: ["Microwave Device"]
 *         summary: "Create Microwave device"
 *         consumes:
 *          - "application/json"
 *         produces:
 *          - "application/json"
 *         responses:
 *             "200":
 *                 description: "Newly created Microwave devices"
 *             "500":
 *                 description: "Internal Server Error"
 *   /microwave/{deviceId}:
 *       get:
 *           tags: ["Microwave Device"]
 *           summary: "Get Microwave device"
 *           consumes:
 *            - "application/json"
 *           produces:
 *            - "application/json"
 *           parameters:
 *           - name: "deviceId"
 *             in: "path"
 *             description: "Id of Microwave device"
 *             required: true
 *             type: "string"
 *           responses:
 *               "200":
 *                   description: "Microwave device"
 *               "404":
 *                   description: "Microwave device not found"
 *               "500":
 *                   description: "Internal Server Error"
 *       put:
 *           tags: ["Microwave Device"]
 *           summary: "Update Microwave device"
 *           consumes:
 *            - "application/json"
 *           produces:
 *            - "application/json"
 *           parameters:
 *           - name: "deviceId"
 *             in: "path"
 *             description: "Id of Microwave device"
 *             required: true
 *             type: "string"
 *           responses:
 *               "200":
 *                   description: "An updated Microwave device"
 *               "404":
 *                   description: "Microwave device not found"
 *               "500":
 *                   description: "Internal Server Error"
  *       delete:
 *           tags: ["Microwave Device"]
 *           summary: "Delete Microwave device"
 *           consumes:
 *            - "application/json"
 *           produces:
 *            - "application/json"
 *           parameters:
 *           - name: "deviceId"
 *             in: "path"
 *             description: "Id of Microwave device"
 *             required: true
 *             type: "string"
 *           responses:
 *               "200":
 *                   description: "A deleted Microwave device"
 *               "404":
 *                   description: "Microwave device not found"
 *               "500":
 *                   description: "Internal Server Error"
 *   /microwave/public-link/{deviceId}:
 *       get:
 *           tags: ["Microwave Public Link"]
 *           summary: "Get Microwave device public link"
 *           consumes:
 *            - "application/json"
 *           produces:
 *            - "application/json"
 *           parameters:
 *           - name: "deviceId"
 *             in: "path"
 *             description: "Id of Microwave device"
 *             required: true
 *             type: "string"
 *           responses:
 *               "200":
 *                   description: "Microwave device public link"
 *               "404":
 *                   description: "Microwave device not found"
 *               "500":
 *                   description: "Internal Server Error"
 *   /session/{deviceId}:
 *       get:
 *           tags: ["Microwave Session Control"]
 *           summary: "Get Microwave device session"
 *           consumes:
 *            - "application/json"
 *           produces:
 *            - "application/json"
 *           parameters:
 *           - name: "deviceId"
 *             in: "path"
 *             description: "Id of Microwave device"
 *             required: true
 *             type: "string"
 *           responses:
 *               "200":
 *                   description: "Microwave device session"
 *               "404":
 *                   description: "Microwave device not found"
 *               "500":
 *                   description: "Internal Server Error"
 *       put:
 *           tags: ["Microwave Session Control"]
 *           summary: "Update/Control Microwave device session"
 *           consumes:
 *            - "application/json"
 *           produces:
 *            - "application/json"
 *           parameters:
 *           - name: "deviceId"
 *             in: "path"
 *             description: "Id of Microwave device"
 *             required: true
 *             type: "string"
 *           responses:
 *               "200":
 *                   description: "An updated Microwave device session"
 *               "404":
 *                   description: "Microwave device not found"
 *               "500":
 *                   description: "Internal Server Error"
*/

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const microwaveController = require("../controllers/microwaveController");

router.use(authController.protect);
router.route('/')
    .get(microwaveController.getAllMicrowaveDevices)
    .post(microwaveController.createMicrowaveDevice);
router.route('/:deviceId')
    .get(microwaveController.getMicrowaveDevice)
    .put(microwaveController.updateMicrowaveDevice)
    .delete(microwaveController.deleteMicrowaveDevice);
router.route('/public-link/:deviceId')
    .get(microwaveController.getMicrowaveDevicePublicLink)
router.route('/session/:deviceId')
    .get(microwaveController.getMicrowaveDeviceSessionInfo)
    .put(microwaveController.updateMicrowaveDeviceSessionInfo)

module.exports = router;
