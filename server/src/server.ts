import app from './app';
import { PORT } from './config';

app.listen(PORT, () => {
  console.log(`🍔 Burger Box server running on port ${PORT}`);
});
