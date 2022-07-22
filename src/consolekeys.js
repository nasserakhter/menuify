export default class ConsoleKeys {
    static space = '\x20';
    static exclamation = '\x21';
    static doublequote = '\x22';
    static hashtag = '\x23';
    static dollar = '\x24';
    static percent = '\x25';
    static ampersand = '\x26';
    static singlequote = '\x27';
    static openParenthesis = '\x28';
    static closeParenthesis = '\x29';
    static asterisk = '\x2a';
    static plus = '\x2b';
    static command = '\x2c';
    static hyphen = '\x2d';
    static period = '\x2e';
    static forwardSlash = '\x2f';
    static zero = '\x30';
    static one = '\x31';
    static two = '\x32';
    static three = '\x33';
    static four = '\x34';
    static five = '\x35';
    static six = '\x36';
    static seven = '\x37';
    static eight = '\x38';
    static nine = '\x39';
    static colon = '\x3a';
    static semicolon = '\x3b';
    static lessThan = '\x3c';
    static equals = '\x3d';
    static greaterThan = '\x3e';
    static question = '\x3f';
    static at = '\x40';
    static A = '\x41';
    static B = '\x42';
    static C = '\x43';
    static D = '\x44';
    static E = '\x45';
    static F = '\x46';
    static G = '\x47';
    static H = '\x48';
    static I = '\x49';
    static J = '\x4a';
    static K = '\x4b';
    static L = '\x4c';
    static M = '\x4d';
    static N = '\x4e';
    static O = '\x4f';
    static P = '\x50';
    static Q = '\x51';
    static R = '\x52';
    static S = '\x53';
    static T = '\x54';
    static U = '\x55';
    static V = '\x56';
    static W = '\x57';
    static X = '\x58';
    static Y = '\x59';
    static Z = '\x5a';
    static openBracket = '\x5b';
    static backSlash = '\x5c';
    static closeBracket = '\x5d';
    static caret = '\x5e';
    static underscore = '\x5f';
    static apostrophe = '\x60';
    static a = '\x61';
    static b = '\x62';
    static c = '\x63';
    static d = '\x64';
    static e = '\x65';
    static f = '\x66';
    static g = '\x67';
    static h = '\x68';
    static i = '\x69';
    static j = '\x6a';
    static k = '\x6b';
    static l = '\x6c';
    static m = '\x6d';
    static n = '\x6e';
    static o = '\x6f';
    static p = '\x70';
    static q = '\x71';
    static r = '\x72';
    static s = '\x73';
    static t = '\x74';
    static u = '\x75';
    static v = '\x76';
    static w = '\x77';
    static x = '\x78';
    static y = '\x79';
    static z = '\x7a';
    static openBrace = '\x7b';
    static pipe = '\x7c';
    static closeBrace = '\x7d';
    static tilde = '\x7e';
    static backspace = '\x7f';
    static backspaceWin = '\b';
    static tab = '\x09';
    static linefeed = '\x0a';
    static enter = '\x0d';
    static escape = '\x1b';
    static null = '\x00';
    static bell = '\x07';
    static sigint = '\x03';
    static right = this.escape + '[C';
    static left = this.escape + '[D';
    static up = this.escape + '[A';
    static down = this.escape + '[B';
    static hideCursor = this.escape + '[?25l';
    static showCursor = this.escape + '[?25h';
    static clear = this.escape + '[H' + this.escape + '[2J';
    static bufferSecondary = this.escape + '[?1049h';
    static bufferPrimary = this.escape + '[?1049l';
}