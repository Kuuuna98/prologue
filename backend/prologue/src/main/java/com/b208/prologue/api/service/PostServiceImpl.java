package com.b208.prologue.api.service;

import com.b208.prologue.api.request.github.*;
import com.b208.prologue.api.response.ImageResponse;
import com.b208.prologue.api.response.github.PostGetListResponse;
import com.b208.prologue.api.response.github.GetRepoContentResponse;
import com.b208.prologue.api.response.github.PostgetResponse;
import com.b208.prologue.common.Base64Converter;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final WebClient webClient;
    private final Base64Converter base64Converter;
    private final CommonService commonService;

    @Override
    public Map<String, Object> getList(String encodedAccessToken, String githubId, int page) throws Exception {
        String accessToken = base64Converter.decryptAES256(encodedAccessToken);

        Map<String, Object> result = new HashMap<>();
        List<String> content = new ArrayList<>();
        List<String> title = new ArrayList<>();
        List<String> date = new ArrayList<>();
        List<String> directory = new ArrayList<>();

        String url = "/repos/" + githubId + "/" + githubId + ".github.io" + "/contents/";

        PostGetListResponse[] list = webClient.get()
                .uri(url + "content/blog")
                .headers(h -> h.setBearerAuth(accessToken))
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(PostGetListResponse[].class).block();

        for (int i = 6 * page; i < list.length; i++) {

            if(i >= 6 * (page+1)){
                break;
            }
            ////////////////////

//            if(isNumeric(list[i].getName()) == false && list[i].getName().length() != 13) {
//                String post = postService.setItem(url, accessToken, list[i].getPath());
//                temp.add(post);
//                directory.add(list[i].getName());
//
//                StringTokenizer st = new StringTokenizer(post, "\n");
//                int cnt = st.countTokens();
//
//                boolean flag = false;
//                for(int j = 0; j < cnt; j++){
//                    String line = st.nextToken();
//
//                    if(line.contains("date")){
//                        flag = true;
//
//                        String tempDate = line.substring(line.indexOf("\"") + 1);
//                        String[] tmp = tempDate.split("T");
//                        tempDate = tmp[0];
//
//                        date.add(tempDate);
//                        break;
//                    }
//                }
//                if(flag == false){
//                    continue;
//                }
//            }else{
//                temp.add(postService.setItem(url, accessToken, list[i].getPath()));
//                directory.add(list[i].getName());
//
//                Date tempDate = new Date(Long.parseLong(list[i].getName()));
//                SimpleDateFormat dateFormat = new SimpleDateFormat ("yyyy-MM-dd");
//
//                date.add(String.valueOf(dateFormat.format(tempDate)));
//            }

            ////////////////////
            content.add(setItem(url, accessToken, list[i].getPath()));
            directory.add(list[i].getName());
        }

        int cnt = list.length;
        result.put("content", content);
        result.put("directory", directory);
        result.put("postCount", cnt);
        return result;
    }

    public static boolean isNumeric(String s) {
        try {
            Long.parseLong(s);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    @Override
    public List<Map<String, String>> getListImagese(String encodedAccessToken, String githubId, List<String> directories) throws Exception {
        String accessToken = base64Converter.decryptAES256(encodedAccessToken);

        List<Map<String, String>> result = new ArrayList<>();
        Map<String, String> image;

        for (String directory:directories) {
            GetRepoContentResponse[] responses = commonService.getContentList(accessToken, githubId, "content/blog/" + directory);
            image = new HashMap<>();

            for (int i = 0; i < responses.length; i++) {
                if (!responses[i].getName().equals("index.md")) {
                    image.put(directory, responses[i].getUrl());
                    break;
                }else{
                    continue;
                }
            }

            result.add(image);
        }

        return result;
    }


    public String setItem(String url, String accessToken, String path) {
        PostgetResponse item = webClient.get()
                .uri(url + path + "/index.md")
                .headers(h -> h.setBearerAuth(accessToken))
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(PostgetResponse.class).block();

        StringTokenizer st = new StringTokenizer(item.getContent(), "\n");
        StringBuilder sb = new StringBuilder();

        int val = st.countTokens();

        for (int i = 0; i < val; i++) {
            sb.append(st.nextToken());
        }

        String Line = "";
        try {
            Line = base64Converter.decode(sb.toString());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return Line;
    }

    @Override
    public void insertDetailPost(String encodedAccessToken, String githubId, String content, List<MultipartFile> files) throws Exception {
        String accessToken = base64Converter.decryptAES256(encodedAccessToken);
        String commit = "add: 새게시글 작성";

        List<TreeRequest> treeRequestList = new ArrayList<>();

        Long nowDate = System.currentTimeMillis();
        Timestamp timeStamp = new Timestamp(nowDate);
        String directory = String.valueOf(timeStamp.getTime());
        String path = "content/blog/" + directory;

        String encodedContent = commonService.makeBlob(accessToken, githubId, base64Converter.encode(content));
        treeRequestList.add(new TreeRequest(path + "/index.md", "100644", "blob", encodedContent));

        if (files != null && !files.isEmpty()) {
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                String image = new String(Base64.encodeBase64(file.getBytes()));
                encodedContent = commonService.makeBlob(accessToken, githubId, image);
                treeRequestList.add(new TreeRequest(path + "/" + file.getOriginalFilename(), "100644", "blob", encodedContent));
            }
        }
        commonService.multiFileCommit(accessToken, githubId, treeRequestList, commit);
    }

    @Override
    public void updateDetailPost(String encodedAccessToken, String githubId, String path, String content, List<MultipartFile> files, List<String> deletedFiles) throws Exception {
        String accessToken = base64Converter.decryptAES256(encodedAccessToken);
        String commit = "modify: 게시글 수정";

        List<TreeRequest> treeRequestList = new ArrayList<>();

        content = commonService.makeBlob(accessToken, githubId, base64Converter.encode(content));
        treeRequestList.add(new TreeRequest(path + "/index.md", "100644", "blob", content));

        if (deletedFiles != null && !deletedFiles.isEmpty()) {
            for (int i = 0; i < deletedFiles.size(); i++) {
                treeRequestList.add(new TreeRequest(path + "/" + deletedFiles.get(i), "100644", "blob", null));
            }
        }

        if (files != null && !files.isEmpty()) {
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                String image = new String(Base64.encodeBase64(file.getBytes()));
                String encodedContent = commonService.makeBlob(accessToken, githubId, image);
                treeRequestList.add(new TreeRequest(path + "/" + file.getOriginalFilename(), "100644", "blob", encodedContent));
            }
        }
        commonService.multiFileCommit(accessToken, githubId, treeRequestList, commit);
    }

    @Override
    public void deleteDetailPost(String encodedAccessToken, String githubId, String directory) throws Exception{
        String accessToken = base64Converter.decryptAES256(encodedAccessToken);
        String commit = "remove: 게시글 삭제";
        String path = "content/blog/" + directory;

        GetRepoContentResponse[] responses = commonService.getContentList(accessToken, githubId, path);

        List<TreeRequest> treeRequestList = new ArrayList<>();

        for (int i = 0; i < responses.length; i++) {
            treeRequestList.add(new TreeRequest(path+"/"+responses[i].getName(), "100644", "blob", null));
        }

        commonService.multiFileCommit(accessToken, githubId, treeRequestList, commit);
    }

    @Override
    public GetRepoContentResponse getDetailPost(String encodedAccessToken, String githubId, String path) throws Exception {
        String accessToken = base64Converter.decryptAES256(encodedAccessToken);
        return commonService.getDetailContent(accessToken, githubId, path + "/index.md");
    }

    @Override
    public List<ImageResponse> getImages(String encodedAccessToken, String githubId, String path) throws Exception {
        String accessToken = base64Converter.decryptAES256(encodedAccessToken);
        GetRepoContentResponse[] responses = commonService.getContentList(accessToken, githubId, path);
        List<ImageResponse> images = new ArrayList<>();
        for (int i = 0; i < responses.length; i++) {
            if (!responses[i].getName().equals("index.md")) {
                images.add(new ImageResponse(responses[i].getName(), responses[i].getUrl()));
            }
        }
        return images;
    }

}
