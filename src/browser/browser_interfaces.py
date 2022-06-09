
class WindowSize:
    width: float
    height: float

    def __init__(self, width, height):
        self.width = width
        self.height = height

class WindowPosition:
    x: float
    y: float

    def __init__(self, x, y):
        self.x = x
        self.y = y

class OverallBoundary:
    minX: float
    maxX: float
    minY: float
    maxY: float

    def __init__(self, minX, maxX, minY, maxY):
        self.minX = minX
        self.maxX = maxX
        self.minY = minY
        self.maxY = maxY

class WindowMetadata:
    id: int
    is_primary: bool
    size: WindowSize
    position: WindowPosition
    overallBoundary: OverallBoundary

    def __init__(self, id, is_primary, size, position, overallBoundary):
        self.id = id
        self.is_primary = is_primary
        self.size = size
        self.position = position
        self.overallBoundary = overallBoundary
