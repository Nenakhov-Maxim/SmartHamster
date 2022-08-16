import eel
from middle.middle import *

if __name__ == '__main__':
    eel.init('front')
    eel.start('index.html', mode="chrome", size=(1480, 720))