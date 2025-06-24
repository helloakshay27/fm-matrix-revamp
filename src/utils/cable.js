import { createConsumer } from "@rails/actioncable";

const cable = createConsumer("wss://api-tasks.lockated.com/cable"); // use wss:// for production

export default cable;
