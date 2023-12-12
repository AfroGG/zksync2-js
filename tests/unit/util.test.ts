import { expect } from "chai";
import { utils } from "../../src";

describe("utils", () => {
    describe("#createAddress", () => {
        it("should return the correct address", async () => {
            const address = utils.createAddress("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", 1);
            expect(address).to.be.equal("0x4B5DF730c2e6b28E17013A1485E5d9BC41Efe021");
        });
    });

    describe("#create2Address", () => {
        it("should return the correct address", async () => {
            const address = utils.create2Address(
                "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
                "0x010001cb6a6e8d5f6829522f19fa9568660e0a9cd53b2e8be4deb0a679452e41",
                "0x01",
                "0x01",
            );
            expect(address).to.be.equal("0x29bac3E5E8FFE7415F97C956BFA106D70316ad50");
        });
    });

    describe("#applyL1ToL2Alias()", () => {
        it("should return the L2 contract address based on provided L1 contract address", async () => {
            const l1ContractAddress = "0x702942B8205E5dEdCD3374E5f4419843adA76Eeb";
            const l2ContractAddress = utils.applyL1ToL2Alias(l1ContractAddress);
            expect(l2ContractAddress.toLowerCase()).to.be.equal(
                "0x813A42B8205E5DedCd3374e5f4419843ADa77FFC".toLowerCase(),
            );
        });
    });

    describe("#undoL1ToL2Alias()", () => {
        it("should return the L1 contract address based on provided L2 contract address", async () => {
            const l2ContractAddress = "0x813A42B8205E5DedCd3374e5f4419843ADa77FFC";
            const l1ContractAddress = utils.undoL1ToL2Alias(l2ContractAddress);
            expect(l1ContractAddress.toLowerCase()).to.be.equal(
                "0x702942B8205E5dEdCD3374E5f4419843adA76Eeb".toLowerCase(),
            );
        });
        it("should handle a case where L1_TO_L2_ALIAS_OFFSET is greater than the address", () => {
            const l2ContractAddress = "0x100";
            const l1ContractAddress = utils.undoL1ToL2Alias(l2ContractAddress);

            expect(l1ContractAddress.toLowerCase()).to.be.equal(
                "0xeeeeffffffffffffffffffffffffffffffffefef".toLowerCase(),
            );
        });
    });

    describe("#hashBytecode()", () => {
        it("should return the hash of bytecode which length is not 2 bytes so padding needs to be performed", async () => {
            const bytecode =
                "0x000200000000000200010000000103550000006001100270000000130010019d0000008001000039000000400010043f0000000101200190000000290000c13d0000000001000031000000040110008c000000420000413d0000000101000367000000000101043b000000e001100270000000150210009c000000310000613d000000160110009c000000420000c13d0000000001000416000000000110004c000000420000c13d000000040100008a00000000011000310000001702000041000000200310008c000000000300001900000000030240190000001701100197000000000410004c000000000200a019000000170110009c00000000010300190000000001026019000000000110004c000000420000c13d00000004010000390000000101100367000000000101043b000000000010041b0000000001000019000000490001042e0000000001000416000000000110004c000000420000c13d0000002001000039000001000010044300000120000004430000001401000041000000490001042e0000000001000416000000000110004c000000420000c13d000000040100008a00000000011000310000001702000041000000000310004c000000000300001900000000030240190000001701100197000000000410004c000000000200a019000000170110009c00000000010300190000000001026019000000000110004c000000440000613d00000000010000190000004a00010430000000000100041a000000800010043f0000001801000041000000490001042e0000004800000432000000490001042e0000004a00010430000000000000000000000000000000000000000000000000000000000000000000000000ffffffff0000000200000000000000000000000000000040000001000000000000000000000000000000000000000000000000000000000000000000000000006d4ce63c0000000000000000000000000000000000000000000000000000000060fe47b18000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000080000000000000000000000000000000000000000000000000000000000000000000000000000000009c8c8fa789967eb514f3ec9def748480945cc9b10fcbd1a19597d924eb201083";
            const hashedBytecode = utils.hashBytecode(bytecode);
            expect(hashedBytecode).to.be.deep.equal(
                new Uint8Array([
                    1, 0, 0, 27, 57, 231, 154, 55, 0, 164, 201, 96, 244, 120, 23, 112, 54, 34, 224, 133,
                    160, 122, 88, 164, 112, 80, 0, 134, 48, 138, 74, 16,
                ]),
            );
        });

        it("should return the hash of bytecode which length is 2 bytes so padding does not need to be performed", async () => {
            const bytecode =
                "0x0002000000000002000900000000000200010000000103550000006001100270000001980010019d0000008001000039000000400010043f0000000101200190000000340000c13d0000000001000031000000040110008c000003670000413d0000000101000367000000000101043b000000e0011002700000019d0210009c000001420000213d000001a50210009c000001720000213d000001a90210009c000001fd0000613d000001aa0210009c000002210000613d000001ab0110009c000003670000c13d0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000000310004c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d0000000201000039000000000101041a000000400200043d00000000001204350000019801000041000001980320009c00000000010240190000004001100210000001ad011001c70000065c0001042e0000000001000416000000000110004c000003670000c13d00000000020000310000001f01200039000000200a00008a0000000004a1016f000000400100043d0000000003140019000000000443004b00000000040000190000000104004039000001990530009c000003c90000213d0000000104400190000003c90000c13d000000400030043f0000001f0320018f00000001040003670000000505200272000000520000613d000000000600001900000005076002100000000008710019000000000774034f000000000707043b00000000007804350000000106600039000000000756004b0000004a0000413d000000000630004c000000610000613d0000000505500210000000000454034f00000000055100190000000303300210000000000605043300000000063601cf000000000636022f000000000404043b0000010003300089000000000434022f00000000033401cf000000000363019f00000000003504350000019a03000041000000600420008c000000000400001900000000040340190000019a05200197000000000650004c000000000300a0190000019a0550009c000000000304c019000000000330004c000003670000c13d0000000034010434000001990540009c000003670000213d000000000221001900000000041400190000001f054000390000019a06000041000000000725004b000000000700001900000000070680190000019a055001970000019a08200197000000000985004b0000000006008019000000000585013f0000019a0550009c00000000050700190000000005066019000000000550004c000003670000c13d0000000005040433000001990650009c000003c90000213d0000003f065000390000000006a6016f000000400b00043d00000000066b00190000000007b6004b00000000070000190000000107004039000001990860009c000003c90000213d0000000107700190000003c90000c13d000000400060043f000000000c5b043600000020065000390000000007460019000000000727004b000003670000213d000000000750004c0000009e0000613d000000000700001900000020077000390000000008b70019000000000947001900000000090904330000000000980435000000000857004b000000970000413d00000000046b001900000000000404350000000003030433000001990430009c000003670000213d00000000031300190000001f043000390000019a05000041000000000624004b000000000600001900000000060580190000019a044001970000019a07200197000000000874004b0000000005008019000000000474013f0000019a0440009c00000000040600190000000004056019000000000440004c000003670000c13d0000000004030433000001990540009c000003c90000213d0000003f054000390000000005a5016f000000400800043d0000000005580019000000000685004b00000000060000190000000106004039000001990750009c000003c90000213d0000000106600190000003c90000c13d000000400050043f0000000005480436000800000005001d00000020054000390000000006350019000000000226004b000003670000213d00060000000c001d00090000000b001d00070000000a001d000000000240004c000000d50000613d000000000200001900000020022000390000000006820019000000000732001900000000070704330000000000760435000000000642004b000000ce0000413d0000000002580019000000000002043500000040011000390000000001010433000500000001001d000000ff0110008c0000000901000029000003670000213d0000000001010433000400000001001d000001990110009c000003c90000213d000100000008001d0000000301000039000300000001001d000000000101041a000000010210019000000001011002700000007f0310018f0000000001036019000200000001001d0000001f0110008c00000000010000190000000101002039000000010110018f000000000112004b0000021b0000c13d0000000201000029000000200110008c000001100000413d0000000301000029000000000010043500000198010000410000000002000414000001980320009c0000000001024019000000c0011002100000019b011001c70000801002000039065b06560000040f0000000102200190000003670000613d00000004030000290000001f023000390000000502200270000000200330008c0000000002004019000000000301043b00000002010000290000001f01100039000000050110027000000000011300190000000002230019000000000312004b000001100000813d000000000002041b0000000102200039000000000312004b0000010c0000413d00000004010000290000001f0110008c000004990000a13d0000000301000029000000000010043500000198010000410000000002000414000001980320009c0000000001024019000000c0011002100000019b011001c70000801002000039065b06560000040f000000010220019000000007020000290000000906000029000003670000613d000000040300002900000000032301700000002002000039000000000101043b000001300000613d0000002002000039000000000400001900000000056200190000000005050433000000000051041b000000200220003900000001011000390000002004400039000000000534004b000001280000413d0000000404000029000000000343004b0000013e0000813d00000004030000290000000303300210000000f80330018f000000010400008a000000000334022f000000000343013f000000090400002900000000024200190000000002020433000000000232016f000000000021041b0000000401000029000000010110021000000001011001bf000004a70000013d0000019e0210009c000001c60000213d000001a20210009c000002440000613d000001a30210009c000002700000613d000001a40110009c000003670000c13d0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000000310004c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d0000000405000039000000000405041a000000010640019000000001014002700000007f0210018f00000000010260190000001f0210008c00000000020000190000000102002039000000000224013f00000001022001900000021b0000c13d000000400200043d0000000003120436000000000660004c000003800000c13d000001000500008a000000000454016f0000000000430435000000000110004c000000200400003900000000040060190000038d0000013d000001a60210009c000002940000613d000001a70210009c000002e30000613d000001a80110009c000003670000c13d0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000400310008c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d00000004010000390000000101100367000000000101043b000900000001001d000001ac0110009c000003670000213d0000000001000411000700000001001d00000000001004350000000101000039000800000001001d000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f0000000102200190000003670000613d000000000101043b00000009020000290000000000200435000000200010043f00000024010000390000000101100367000000000101043b000600000001001d00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f0000000102200190000003670000613d000000000101043b000000000101041a00000006020000290000000003210019000000000113004b000000000100001900000001010040390000000101100190000003ae0000c13d00000007010000290000000902000029065b05ea0000040f000000400100043d000000080200002900000000002104350000019802000041000001980310009c00000000010280190000004001100210000001ad011001c70000065c0001042e0000019f0210009c000002ff0000613d000001a00210009c000003510000613d000001a10110009c000003670000c13d0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000400310008c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d00000001020003670000000401200370000000000101043b000001ac0310009c000003670000213d0000002402200370000000000302043b000001ac0230009c000003670000213d00000000001004350000000101000039000000200010043f0000004002000039000900000002001d0000000001000019000800000003001d065b052b0000040f00000008020000290000000000200435000000200010043f00000000010000190000000902000029065b052b0000040f000000000101041a000000400200043d00000000001204350000019801000041000001980320009c00000000010240190000004001100210000001ad011001c70000065c0001042e0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000000310004c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d0000000303000039000000000203041a000000010420019000000001012002700000007f0510018f000000000601001900000000060560190000001f0560008c00000000050000190000000105002039000000000552013f0000000105500190000003690000613d000001b70100004100000000001004350000002201000039000000040010043f000001b8010000410000065d000104300000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000400310008c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d00000001010003670000000402100370000000000202043b000001ac0320009c000003670000213d0000002401100370000000000301043b0000000001000411065b05ea0000040f0000000101000039000000400200043d00000000001204350000019801000041000001980320009c00000000010240190000004001100210000001ad011001c70000065c0001042e0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000400310008c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d00000001010003670000000402100370000000000402043b000001ac0240009c000003670000213d0000002401100370000000000501043b000000000140004c000003a60000c13d000000400100043d0000004402100039000001b503000041000000000032043500000024021000390000001f030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b6011001c70000065d000104300000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000200310008c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d00000004010000390000000101100367000000000101043b000001ac0210009c000003670000213d0000000000100435000000200000043f00000040020000390000000001000019065b052b0000040f000000000101041a000000400200043d00000000001204350000019801000041000001980320009c00000000010240190000004001100210000001ad011001c70000065c0001042e0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000600310008c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d00000001010003670000000402100370000000000402043b000001ac0240009c000003670000213d0000002402100370000000000202043b000900000002001d000001ac0220009c000003670000213d0000004401100370000000000101043b000700000001001d00000000004004350000000101000039000600000001001d000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039000800000004001d065b06560000040f0000000102200190000003670000613d000000000101043b0000000002000411000500000002001d0000000000200435000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f00000008030000290000000102200190000003670000613d000000000101043b000000000201041a000000010100008a000000000112004b0000041c0000c13d000000000103001900000009020000290000000703000029065b05570000040f000000400100043d000000060200002900000000002104350000019802000041000001980310009c00000000010280190000004001100210000001ad011001c70000065c0001042e0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000000310004c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d0000000501000039000000000101041a000000ff0110018f000000400200043d00000000001204350000019801000041000001980320009c00000000010240190000004001100210000001ad011001c70000065c0001042e0000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000400310008c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d00000001010003670000000402100370000000000202043b000900000002001d000001ac0220009c000003670000213d0000002401100370000000000101043b000800000001001d0000000001000411000600000001001d00000000001004350000000101000039000700000001001d000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f0000000102200190000003670000613d000000000101043b00000009020000290000000000200435000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f0000000102200190000003670000613d000000000101043b000000000101041a0000000803000029000000000231004b0000040f0000813d000000400100043d0000006402100039000001af0300004100000000003204350000004402100039000001b0030000410000000000320435000000240210003900000025030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b2011001c70000065d000104300000000001000416000000000110004c000003670000c13d000000040100008a00000000011000310000019a02000041000000400310008c000000000300001900000000030240190000019a01100197000000000410004c000000000200a0190000019a0110009c00000000010300190000000001026019000000000110004c000003670000c13d00000001010003670000000402100370000000000202043b000001ac0320009c000003730000a13d00000000010000190000065d00010430000000800060043f000000000440004c000003b40000c13d000001000300008a000000000232016f000000a00020043f000000000160004c000000c001000039000000a001006039000003c30000013d0000002401100370000000000301043b0000000001000411065b05570000040f0000000101000039000000400200043d00000000001204350000019801000041000001980320009c00000000010240190000004001100210000001ad011001c70000065c0001042e0000000000500435000000000410004c00000000040000190000038d0000613d000001b30500004100000000040000190000000006430019000000000705041a000000000076043500000001055000390000002004400039000000000614004b000003860000413d0000003f01400039000000200300008a000000000331016f0000000001230019000000000331004b00000000040000190000000104004039000001990310009c000003c90000213d0000000103400190000003c90000c13d000000400010043f000900000001001d065b05410000040f000000090400002900000000014100490000019802000041000001980310009c0000000001028019000001980340009c000000000204401900000040022002100000006001100210000000000121019f0000065c0001042e0000000201000039000000000301041a0000000002530019000000000332004b000000000300001900000001030040390000000103300190000003de0000613d000001b70100004100000000001004350000001101000039000000040010043f000001b8010000410000065d000104300000000000300435000000a001000039000000000260004c000003cf0000613d000001bf0200004100000000040000190000000003040019000000000402041a000000a005300039000000000045043500000001022000390000002004300039000000000564004b000003ba0000413d000000c0013000390000001f01100039000000200200008a000000000121016f000001c002100041000001c10220009c000003cf0000813d000001b70100004100000000001004350000004101000039000000040010043f000001b8010000410000065d00010430000900000001001d000000400010043f0000008002000039065b05410000040f000000090400002900000000014100490000019802000041000001980310009c0000000001028019000001980340009c000000000204401900000040022002100000006001100210000000000121019f0000065c0001042e000800000005001d000000000021041b0000000000400435000000200000043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039000900000004001d065b06560000040f00000009060000290000000102200190000003670000613d000000000101043b000000000201041a00000008030000290000000002320019000000000021041b000000400100043d000000000031043500000198020000410000000003000414000001980430009c0000000003028019000001980410009c00000000010280190000004001100210000000c002300210000000000112019f0000019b011001c70000800d020000390000000303000039000001b4040000410000000005000019065b06510000040f0000000101200190000003670000613d000000400100043d000000010200003900000000002104350000019802000041000001980310009c00000000010280190000004001100210000001ad011001c70000065c0001042e000000000331004900000006010000290000000902000029065b05ea0000040f000000400100043d000000070200002900000000002104350000019802000041000001980310009c00000000010280190000004001100210000001ad011001c70000065c0001042e0000000701000029000000000112004b000004310000813d000000400100043d0000004402100039000001be03000041000000000032043500000024021000390000001d030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b6011001c70000065d00010430000400000002001d000000000130004c000004490000c13d000000400100043d0000006402100039000001bc0300004100000000003204350000004402100039000001bd030000410000000000320435000000240210003900000024030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b2011001c70000065d000104300000000501000029000001ac01100198000500000001001d000004620000c13d000000400100043d0000006402100039000001ba0300004100000000003204350000004402100039000001bb030000410000000000320435000000240210003900000022030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b2011001c70000065d00010430000000080100002900000000001004350000000601000029000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f0000000102200190000003670000613d000000000101043b00000005020000290000000000200435000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f00000004030000290000000102200190000003670000613d00000007020000290000000002230049000000000101043b000000000021041b000000400100043d000000000021043500000198020000410000000003000414000001980430009c0000000003028019000001980410009c00000000010280190000004001100210000000c002300210000000000112019f0000019b011001c70000800d020000390000000303000039000001b90400004100000008050000290000000506000029065b06510000040f00000008030000290000000101200190000002d60000c13d000003670000013d0000000401000029000000000110004c00000000010000190000049f0000613d0000000601000029000000000101043300000004040000290000000302400210000000010300008a000000000223022f000000000232013f000000000121016f0000000102400210000000000121019f0000000302000029000000000012041b00000001010000290000000001010433000900000001001d000001990110009c000003c90000213d0000000401000039000600000001001d000000000101041a000000010210019000000001021002700000007f0320018f0000000002036019000400000002001d0000001f0220008c00000000020000190000000102002039000000000121013f00000001011001900000021b0000c13d0000000401000029000000200110008c000004dc0000413d0000000601000029000000000010043500000198010000410000000002000414000001980320009c0000000001024019000000c0011002100000019b011001c70000801002000039065b06560000040f0000000102200190000003670000613d00000009030000290000001f023000390000000502200270000000200330008c0000000002004019000000000301043b00000004010000290000001f01100039000000050110027000000000011300190000000002230019000000000312004b000004dc0000813d000000000002041b0000000102200039000000000312004b000004d80000413d00000009010000290000001f0110008c0000050e0000a13d0000000601000029000000000010043500000198010000410000000002000414000001980320009c0000000001024019000000c0011002100000019b011001c70000801002000039065b06560000040f000000010220019000000007020000290000000106000029000003670000613d000000090300002900000000032301700000002002000039000000000101043b000004fc0000613d0000002002000039000000000400001900000000056200190000000005050433000000000051041b000000200220003900000001011000390000002004400039000000000534004b000004f40000413d0000000904000029000000000343004b0000050a0000813d00000009030000290000000303300210000000f80330018f000000010400008a000000000334022f000000000343013f000000010400002900000000024200190000000002020433000000000232016f000000000021041b0000000101000039000000090200002900000001022002100000051b0000013d0000000901000029000000000110004c0000000001000019000005140000613d0000000801000029000000000101043300000009040000290000000302400210000000010300008a000000000223022f000000000232013f000000000221016f0000000101400210000000000112019f0000000602000029000000000012041b0000000501000039000000000201041a000001000300008a000000000232016f0000000503000029000000ff0330018f000000000232019f000000000021041b0000002001000039000001000010044300000120000004430000019c010000410000065c0001042e0000019803000041000001980410009c00000000010380190000004001100210000001980420009c00000000020380190000006002200210000000000112019f0000000002000414000001980420009c0000000002038019000000c002200210000000000112019f000001c2011001c70000801002000039065b06560000040f00000001022001900000053f0000613d000000000101043b000000000001042d00000000010000190000065d0001043000000020030000390000000004310436000000000302043300000000003404350000004001100039000000000430004c000005500000613d000000000400001900000000054100190000002004400039000000000624001900000000060604330000000000650435000000000534004b000005490000413d000000000231001900000000000204350000001f02300039000000200300008a000000000232016f0000000001210019000000000001042d0004000000000002000400000003001d000001ac01100198000005ab0000613d000001ac02200198000200000002001d000005c00000613d000300000001001d0000000000100435000000200000043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f0000000102200190000005a90000613d000000000101043b000000000201041a0000000401000029000100000002001d000000000112004b000005d50000413d00000003010000290000000000100435000000200000043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f0000000102200190000005a90000613d000000040200002900000001030000290000000002230049000000000101043b000000000021041b0000000201000029000000000010043500000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f0000000102200190000005a90000613d000000000101043b000000000201041a00000004030000290000000002320019000000000021041b000000400100043d000000000031043500000198020000410000000003000414000001980430009c0000000003028019000001980410009c00000000010280190000004001100210000000c002300210000000000112019f0000019b011001c70000800d020000390000000303000039000001b40400004100000003050000290000000206000029065b06510000040f0000000101200190000005a90000613d000000000001042d00000000010000190000065d00010430000000400100043d0000006402100039000001c70300004100000000003204350000004402100039000001c8030000410000000000320435000000240210003900000025030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b2011001c70000065d00010430000000400100043d0000006402100039000001c50300004100000000003204350000004402100039000001c6030000410000000000320435000000240210003900000023030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b2011001c70000065d00010430000000400100043d0000006402100039000001c30300004100000000003204350000004402100039000001c4030000410000000000320435000000240210003900000026030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b2011001c70000065d000104300003000000000002000001ac01100198000006270000613d000200000003001d000001ac02200198000300000002001d0000063c0000613d000100000001001d00000000001004350000000101000039000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f00000001022001900000000304000029000006250000613d000000000101043b0000000000400435000000200010043f00000198010000410000000002000414000001980320009c0000000001024019000000c001100210000001ae011001c70000801002000039065b06560000040f00000003060000290000000102200190000006250000613d000000000101043b0000000202000029000000000021041b000000400100043d000000000021043500000198020000410000000003000414000001980430009c0000000003028019000001980410009c00000000010280190000004001100210000000c002300210000000000112019f0000019b011001c70000800d020000390000000303000039000001b9040000410000000105000029065b06510000040f0000000101200190000006250000613d000000000001042d00000000010000190000065d00010430000000400100043d0000006402100039000001bc0300004100000000003204350000004402100039000001bd030000410000000000320435000000240210003900000024030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b2011001c70000065d00010430000000400100043d0000006402100039000001ba0300004100000000003204350000004402100039000001bb030000410000000000320435000000240210003900000022030000390000000000320435000001b10200004100000000002104350000000402100039000000200300003900000000003204350000019802000041000001980310009c00000000010280190000004001100210000001b2011001c70000065d0001043000000654002104210000000102000039000000000001042d0000000002000019000000000001042d00000659002104230000000102000039000000000001042d0000000002000019000000000001042d0000065b000004320000065c0001042e0000065d000104300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffff000000000000000000000000000000000000000000000000ffffffffffffffff8000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000002000000000000000000000000000000002000000000000000000000000000000400000010000000000000000000000000000000000000000000000000000000000000000000000000040c10f1800000000000000000000000000000000000000000000000000000000a457c2d600000000000000000000000000000000000000000000000000000000a457c2d700000000000000000000000000000000000000000000000000000000a9059cbb00000000000000000000000000000000000000000000000000000000dd62ed3e0000000000000000000000000000000000000000000000000000000040c10f190000000000000000000000000000000000000000000000000000000070a082310000000000000000000000000000000000000000000000000000000095d89b410000000000000000000000000000000000000000000000000000000023b872dc0000000000000000000000000000000000000000000000000000000023b872dd00000000000000000000000000000000000000000000000000000000313ce56700000000000000000000000000000000000000000000000000000000395093510000000000000000000000000000000000000000000000000000000006fdde0300000000000000000000000000000000000000000000000000000000095ea7b30000000000000000000000000000000000000000000000000000000018160ddd000000000000000000000000ffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000200000000000000000000000000200000000000000000000000000000000000040000000000000000000000000207a65726f00000000000000000000000000000000000000000000000000000045524332303a2064656372656173656420616c6c6f77616e63652062656c6f7708c379a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000840000000000000000000000008a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19bddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef45524332303a206d696e7420746f20746865207a65726f20616464726573730000000000000000000000000000000000000000640000000000000000000000004e487b710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000008c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925737300000000000000000000000000000000000000000000000000000000000045524332303a20617070726f766520746f20746865207a65726f206164647265726573730000000000000000000000000000000000000000000000000000000045524332303a20617070726f76652066726f6d20746865207a65726f2061646445524332303a20696e73756666696369656e7420616c6c6f77616e6365000000c2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85bffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffffffffff00000000000000800200000000000000000000000000000000000000000000000000000000000000616c616e6365000000000000000000000000000000000000000000000000000045524332303a207472616e7366657220616d6f756e7420657863656564732062657373000000000000000000000000000000000000000000000000000000000045524332303a207472616e7366657220746f20746865207a65726f2061646472647265737300000000000000000000000000000000000000000000000000000045524332303a207472616e736665722066726f6d20746865207a65726f206164000000000000000000000000000000000000000000000000000000000000000018469939d00da7016fd24775544e09a6a1ad29697146a060aa4a0baa144c2ede";
            const hashedBytecode = utils.hashBytecode(bytecode);
            expect(hashedBytecode).to.be.deep.equal(
                new Uint8Array([
                    1, 0, 1, 203, 106, 110, 141, 95, 104, 41, 82, 47, 25, 250, 149, 104, 102, 14, 10,
                    156, 213, 59, 46, 139, 228, 222, 176, 166, 121, 69, 46, 65,
                ]),
            );
        });
    });

    describe("#isETH", () => {
        it("should return true for ETH_ADDRESS", () => {
            const result = utils.isETH("0x0000000000000000000000000000000000000000");
            expect(result).to.be.true;
        });
        it("should return true for L2_ETH_TOKEN_ADDRESS", () => {
            const result = utils.isETH("0x000000000000000000000000000000000000800a");
            expect(result).to.be.true;
        });

        it("should return false for other addresses", () => {
            const result = utils.isETH("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049");
            expect(result).to.be.false;
        });
    });
});
